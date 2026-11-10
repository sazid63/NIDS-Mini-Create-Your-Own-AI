# predict.py -- use the packed AI like a real guard, one flow at a time
# Needs only numpy + onnxruntime (no PyTorch!).

import json
import time
import numpy as np
import onnxruntime as ort

# ▶ PART 1: Open the packed brain and the ruler we used during training
session = ort.InferenceSession("nids_mini.onnx", providers=["CPUExecutionProvider"])
meta = json.load(open("data/meta.json"))
mean, scale = np.array(meta["mean"]), np.array(meta["scale"])

# ▶ PART 2: A helper that prepares a raw flow EXACTLY like in training
def check_flow(raw_features):
    x = np.array(raw_features, dtype=np.float64)
    x = np.sign(x) * np.log1p(np.abs(x))                  # squash giant numbers
    x = ((x - mean) / scale).astype(np.float32)[None, :]   # same ruler, as one row
    scores = session.run(None, {"flow_features": x})[0][0]
    chance = np.exp(scores - scores.max())
    chance /= chance.sum()                                 # turn scores into percentages
    best = int(chance.argmax())
    return meta["classes"][best], float(chance[best])

# ▶ PART 3: Try it on real traffic we saved, and time it
for flow in json.load(open("data/sample_flows.json")):
    start = time.perf_counter()
    kind, sure = check_flow(flow["features"])
    ms = (time.perf_counter() - start) * 1000
    alarm = "ALLOW " if kind == "BENIGN" else "BLOCK "
    print(f"{alarm}{kind:<14} ({sure:.1%} sure)  real answer: {flow['truth']:<12}  took {ms:.3f} ms")

# ▶ PART 4: Measure the pure speed of the brain alone (average of 1,000 tries)
one_row = np.zeros((1, 78), dtype=np.float32)
session.run(None, {"flow_features": one_row})              # warm-up so the first slow try doesn't count
start = time.perf_counter()
for _ in range(1000):
    session.run(None, {"flow_features": one_row})
seconds = time.perf_counter() - start
print(f"Average brain speed: {seconds:.3f} ms per flow  ({seconds:.2f} s for 1,000 flows)")
