---
title: NIDS Mini Guard
emoji: 🛡️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# NIDS Mini: the AI project

Build, test and deploy a small (3.5 million parameter) AI that spots network attacks.
Follow the guide in the website (the folder above), or run these in order:

```
pip install -r requirements.txt
python get_data.py
python prepare_data.py
python model.py
python train.py
python evaluate.py
python export_onnx.py
python predict.py
python -m uvicorn serve:app --port 8000
```

Data: CIC-IDS2017 (Canadian Institute for Cybersecurity), mirrored at `rdpahalavan/CIC-IDS2017` on Hugging Face (Apache-2.0).
