# export_onnx.py -- pack the trained brain into one small file that runs anywhere

import numpy as np
import onnxruntime as ort
import torch
from model import ResFlowNet

# ▶ PART 1: Load the best brain and switch to "working mode"
brain = ResFlowNet()
brain.load_state_dict(torch.load("data/best_model.pth", map_location="cpu"))
brain.eval()

# ▶ PART 2: Save it as an ONNX file
# We show it one pretend row so it can trace the path the numbers take.
# dynamic_axes says "the number of rows can change" (one flow or one thousand).
example = torch.randn(1, 78)
torch.onnx.export(brain, example, "nids_mini.onnx",
                  input_names=["flow_features"], output_names=["scores"],
                  dynamic_axes={"flow_features": {0: "rows"}, "scores": {0: "rows"}},
                  opset_version=17, dynamo=False)   # dynamo=False = the older, steady exporter (the new one crashes on some Windows screens)
print("Saved nids_mini.onnx")

# ▶ PART 3: Prove the new file gives the same answers as the original
session = ort.InferenceSession("nids_mini.onnx", providers=["CPUExecutionProvider"])
test_rows = torch.randn(8, 78)
original = brain(test_rows).detach().numpy()
packed = session.run(None, {"flow_features": test_rows.numpy()})[0]
print("Biggest difference between the two:", float(np.abs(original - packed).max()))
