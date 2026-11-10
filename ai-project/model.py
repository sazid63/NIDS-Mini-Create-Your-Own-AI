# model.py -- build the AI brain (we call it ResFlowNet)

import torch
import torch.nn as nn

# ▶ PART 1: One "thinking block" with a shortcut
class Block(nn.Module):
    def __init__(self, size, forget=0.1):
        super().__init__()
        self.layer1 = nn.Linear(size, size)      # mixes the clues together
        self.tidy1 = nn.BatchNorm1d(size)        # keeps the numbers from getting wild
        self.layer2 = nn.Linear(size, size)      # mixes them a second time
        self.tidy2 = nn.BatchNorm1d(size)
        self.forget = nn.Dropout(forget)         # randomly ignores a few clues so the AI can't cheat by memorising

    def forward(self, x):
        out = torch.relu(self.tidy1(self.layer1(x)))   # think once
        out = self.forget(out)
        out = self.tidy2(self.layer2(out))             # think twice
        return torch.relu(out + x)                     # the SHORTCUT: add the original clues back in

# ▶ PART 2: Stack the blocks into the full brain
class ResFlowNet(nn.Module):
    def __init__(self, n_clues=78, size=536, n_blocks=6, n_kinds=15):
        super().__init__()
        self.start = nn.Sequential(                    # 78 clues -> 536 "thoughts"
            nn.Linear(n_clues, size), nn.BatchNorm1d(size), nn.ReLU())
        self.blocks = nn.Sequential(*[Block(size) for _ in range(n_blocks)])  # 6 blocks in a row
        self.finish = nn.Linear(size, n_kinds)         # 536 thoughts -> 15 scores (one per kind)

    def forward(self, x):
        return self.finish(self.blocks(self.start(x)))

# ▶ PART 3: Count the knobs (parameters) when this file is run directly
if __name__ == "__main__":
    brain = ResFlowNet()
    knobs = sum(p.numel() for p in brain.parameters())
    print(f"Total parameters: {knobs:,}")                 # about 3.5 million
    print("Test run with 4 fake rows ->", brain.eval()(torch.randn(4, 78)).shape)
