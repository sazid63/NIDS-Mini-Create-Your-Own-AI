# evaluate.py -- the final exam: traffic the AI has never seen

import json
import numpy as np
import torch
from sklearn.metrics import accuracy_score, classification_report, f1_score
from model import ResFlowNet

# ▶ PART 1: Load the exam pile and the best brain we saved
meta = json.load(open("data/meta.json"))
data = np.load("data/prepared.npz")
brain = ResFlowNet()
brain.load_state_dict(torch.load("data/best_model.pth", map_location="cpu"))
brain.eval()                                    # "exam mode": no random ignoring

# ▶ PART 2: Let the AI answer every exam question
with torch.no_grad():
    guesses = brain(torch.from_numpy(data["X_test"])).argmax(dim=1).numpy()
truth = data["y_test"]

# ▶ PART 3: Grade it
accuracy = accuracy_score(truth, guesses)
macro_f1 = f1_score(truth, guesses, average="macro")
print(f"Overall accuracy: {accuracy:.2%}   (how many answers were right)")
print(f"Macro F1 score:   {macro_f1:.2%}   (fair grade: every attack kind counts the same)\n")

# ▶ PART 4: A report card for every kind of traffic
report = classification_report(truth, guesses, target_names=meta["classes"],
                               output_dict=True, zero_division=0)
print(classification_report(truth, guesses, target_names=meta["classes"], zero_division=0))
json.dump({"accuracy": accuracy, "macro_f1": macro_f1, "per_class": report},
          open("data/report.json", "w"), indent=2)
