# serve.py -- put the AI behind a web address so any program can ask it questions

import json
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# ▶ PART 1: Load the brain once, when the server starts
session = ort.InferenceSession("nids_mini.onnx", providers=["CPUExecutionProvider"])
meta = json.load(open("data/meta.json"))
mean, scale = np.array(meta["mean"]), np.array(meta["scale"])
app = FastAPI(title="NIDS Mini")

# ▶ PART 2: Describe what a question looks like
class Flow(BaseModel):
    features: list[float]            # the 78 raw numbers, in the same order as training

# ▶ PART 3: A "are you alive?" address
@app.get("/health")
def health():
    return {"status": "ok", "kinds": len(meta["classes"])}

# ▶ PART 4: The question address: send a flow, get a verdict
@app.post("/predict")
def predict(flow: Flow):
    if len(flow.features) != 78:
        raise HTTPException(400, "Send exactly 78 numbers.")
    x = np.array(flow.features, dtype=np.float64)
    x = np.sign(x) * np.log1p(np.abs(x))
    x = ((x - mean) / scale).astype(np.float32)[None, :]
    scores = session.run(None, {"flow_features": x})[0][0]
    chance = np.exp(scores - scores.max())
    chance /= chance.sum()
    best = int(chance.argmax())
    kind = meta["classes"][best]
    return {"verdict": kind, "confidence": round(float(chance[best]), 4),
            "action": "allow" if kind == "BENIGN" else "block"}
