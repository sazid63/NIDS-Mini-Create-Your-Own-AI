# train.py -- teach the AI by showing it thousands of examples

import json
import numpy as np
import torch
import torch.nn as nn
from sklearn.metrics import f1_score
from torch.utils.data import DataLoader, TensorDataset
from model import ResFlowNet

# ▶ PART 1: Pick the engine
# A graphics card is much faster, but the normal processor works too.
device = "cuda" if torch.cuda.is_available() else "cpu"
torch.manual_seed(42)
print("Training on:", device)

# ▶ PART 2: Load the prepared piles and cut them into small handfuls ("batches")
data = np.load("data/prepared.npz")
train_set = TensorDataset(torch.from_numpy(data["X_train"]), torch.from_numpy(data["y_train"]))
train_loader = DataLoader(train_set, batch_size=512, shuffle=True)
X_val = torch.from_numpy(data["X_val"]).to(device)
y_val = data["y_val"]

# ▶ PART 3: A stricter score-keeper called Focal Loss
# Normal loss treats every mistake the same. Focal Loss shrinks the penalty on
# easy examples the AI already gets right, so it spends its energy on the hard,
# rare attacks. "gamma" controls how strongly it ignores the easy ones.
class FocalLoss(nn.Module):
    def __init__(self, gamma=2.0):
        super().__init__()
        self.gamma = gamma

    def forward(self, scores, answers):
        plain = nn.functional.cross_entropy(scores, answers, reduction="none")  # normal mistake size
        chance_right = torch.exp(-plain)                                        # how sure the AI was of the right answer
        return (((1 - chance_right) ** self.gamma) * plain).mean()              # easy ones shrink toward 0

# ▶ PART 4: Create the brain, the coach, and the lesson plan
brain = ResFlowNet().to(device)
loss_fn = FocalLoss(gamma=2.0)
coach = torch.optim.AdamW(brain.parameters(), lr=1e-3, weight_decay=1e-4)   # AdamW = the coach that nudges the knobs
EPOCHS = 15                                                                  # 15 full passes over the training pile
plan = torch.optim.lr_scheduler.OneCycleLR(coach, max_lr=2e-3, epochs=EPOCHS,
                                           steps_per_epoch=len(train_loader))  # big steps first, tiny steps at the end

# ▶ PART 5: The learning loop
best_f1, history = 0.0, []
for epoch in range(1, EPOCHS + 1):
    brain.train()
    total = 0.0
    for clues, answers in train_loader:
        clues, answers = clues.to(device), answers.to(device)
        coach.zero_grad()                      # 1. wipe the notes from last time
        loss = loss_fn(brain(clues), answers)  # 2. guess, then measure how wrong
        loss.backward()                        # 3. find which knobs caused the mistake
        coach.step()                           # 4. turn those knobs a tiny bit
        plan.step()
        total += loss.item() * len(answers)
    train_loss = total / len(train_set)

    # ▶ PART 6: Practice quiz after every epoch, keep the best brain
    brain.eval()
    with torch.no_grad():
        guesses = brain(X_val).argmax(dim=1).cpu().numpy()
    f1 = f1_score(y_val, guesses, average="macro")
    history.append({"epoch": epoch, "train_loss": train_loss, "val_macro_f1": f1})
    saved = ""
    if f1 > best_f1:
        best_f1 = f1
        torch.save(brain.state_dict(), "data/best_model.pth")
        saved = "  <- new best, saved!"
    print(f"Epoch {epoch:2d}/{EPOCHS}  loss {train_loss:.4f}  quiz score {f1:.4f}{saved}")

# ▶ PART 7: Save a diary of how the learning went (the website uses it to draw a chart)
with open("data/history.json", "w") as f:
    json.dump(history, f)
