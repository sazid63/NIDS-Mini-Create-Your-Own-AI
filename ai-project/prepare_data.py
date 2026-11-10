# prepare_data.py -- turn the raw traffic table into clean numbers the AI can learn from

import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

# ▶ PART 1: Open the table
# One row = one "conversation" between two computers (called a flow).
df = pd.read_parquet("data/Network-Flows/CICIDS_Flow.parquet")
print(f"Loaded {len(df):,} rows")

# ▶ PART 2: Pick the 78 clues and the answer
# We throw away "who is talking" columns (addresses, time). If we kept them, the
# AI could just memorise the attacker's address instead of learning behaviour.
df = df.drop(columns=["flow_id", "source_ip", "destination_ip", "source_port", "Timestamp"])
df["protocol"] = df["protocol"].map({"tcp": 0, "udp": 1, "other": 2})   # words -> numbers
df["attack_label"] = df["attack_label"].str.replace("–", "-", regex=False)  # swap a fancy dash for a plain one
label_column = "attack_label"
feature_names = [c for c in df.columns if c != label_column]
print("Number of clues per row:", len(feature_names))

# ▶ PART 3: Remove broken rows
# Some tools write "infinity" or leave blanks. Models crash on those, so we delete them.
df[feature_names] = df[feature_names].replace([np.inf, -np.inf], np.nan)
df = df.dropna().reset_index(drop=True)

# ▶ PART 4: Turn attack names into numbers
classes = sorted(df[label_column].unique())               # 15 names, A to Z
y = df[label_column].map({name: i for i, name in enumerate(classes)}).values.astype(np.int64)
X = df[feature_names].values.astype(np.float64)

# ▶ PART 5: Split into three piles (like homework, practice quiz, final exam)
# "stratify=y" makes sure even the rarest attack shows up in every pile.
X_train, X_rest, y_train, y_rest = train_test_split(X, y, test_size=0.30, stratify=y, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_rest, y_rest, test_size=0.50, stratify=y_rest, random_state=42)

# ▶ PART 6: Stop the huge piles from drowning the tiny ones
# Normal traffic has 2 million rows, Heartbleed has 11. We keep at most 150,000 per
# kind in the training pile only. The exam pile stays natural, like real life.
rng = np.random.default_rng(42)
keep = []
for c in range(len(classes)):
    rows = np.where(y_train == c)[0]
    if len(rows) > 150_000:
        rows = rng.choice(rows, 150_000, replace=False)
    keep.extend(rows)
keep = np.array(keep)
X_train, y_train = X_train[keep], y_train[keep]

# ▶ PART 7: Squash giant numbers, then put every clue on the same ruler
# Some clues are tiny (1) and some are huge (100,000,000). "log" shrinks the giants
# while keeping the order. Then we shift and stretch each clue so its average is 0.
def squash(a):
    return np.sign(a) * np.log1p(np.abs(a))

S_train = squash(X_train)
mean = S_train.mean(axis=0)
scale = S_train.std(axis=0)
scale[scale == 0] = 1.0                      # avoid dividing by zero

def ruler(a):
    return ((squash(a) - mean) / scale).astype(np.float32)

# ▶ PART 8: Save everything for the next steps
np.savez_compressed("data/prepared.npz",
                    X_train=ruler(X_train), y_train=y_train,
                    X_val=ruler(X_val), y_val=y_val,
                    X_test=ruler(X_test), y_test=y_test)
with open("data/meta.json", "w") as f:
    json.dump({"classes": classes, "feature_names": feature_names,
               "mean": mean.tolist(), "scale": scale.tolist()}, f)

# Also keep a few untouched real rows so we can try the finished AI later.
samples = []
for name in ["BENIGN", "DoS Hulk", "PortScan", "SSH-Patator"]:
    i = int(np.where(y_test == classes.index(name))[0][0])
    samples.append({"truth": name, "features": X_test[i].tolist()})
with open("data/sample_flows.json", "w") as f:
    json.dump(samples, f)

print("Training rows:", len(y_train), "| Practice-quiz rows:", len(y_val), "| Exam rows:", len(y_test))
