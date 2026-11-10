# NIDS Mini: Build Your Own AI Guard

A beginner-first, jargon-free guide **and a real, tested project**. Follow five rooms to build, train, test and deploy a small AI (3,518,319 parameters) that spots network attacks, using real data from the CIC-IDS2017 dataset.

The guide is written so a 12-year-old can follow it: every command, every part of every program, and every tricky word is explained in everyday language, and each room opens with an illustration of what it does.

## What is in this repository

| Folder | What it is |
| --- | --- |
| `src/` | The guide website (React 19, TypeScript, Tailwind CSS v4, Vite). |
| `ai-project/` | The real Python project the guide teaches. Every code sample on the website is read directly from these files, so what you read is what was tested. |

## The five rooms

0. **Start here**: install Python, make a private toolbox, install the tools.
1. **Data Room**: download 2.8 million real traffic records and turn them into 78 clean numbers per row, in three piles (learn, quiz, exam).
2. **Brain Room**: build ResFlowNet: 78 inputs, a start layer, 6 shortcut blocks (width 536), 15 outputs. 3,518,319 parameters.
3. **Training Room**: Focal Loss, AdamW and a one-cycle learning-rate plan, 15 rounds, keeping the best brain.
4. **Testing Room**: an honest exam on unseen traffic, with precision, recall and Macro F1 per attack kind.
5. **Launch Room**: pack the brain as ONNX, serve it with FastAPI, put it in a Docker box, deploy to Hugging Face Spaces.

## Results of the real run (full dataset)

| What | Value |
| --- | --- |
| Parameters | 3,518,319 |
| Overall accuracy on the exam pile (424,152 rows) | 99.66% |
| Macro F1 (fair grade across all 15 kinds) | 80.7% |
| ONNX file | about 14 MB |
| Speed on CPU (ONNX Runtime) | about 0.75 ms per flow |

Weak spots are stated on the site: rare kinds (Infiltration, Bot, SQL injection) and Web XSS, which this dataset makes hard to tell apart from Web Brute Force.

## Run the guide website

```bash
npm install
npm run dev
```

## Run the AI project

```bash
cd ai-project
pip install -r requirements.txt
python get_data.py        # about 370 MB, one time
python prepare_data.py
python model.py
python train.py
python evaluate.py
python export_onnx.py
python predict.py
python -m uvicorn serve:app --port 8000
```

Status of the deployment step: the server (`serve.py`) was tested locally. The `Dockerfile` was written following the Hugging Face Docker Spaces rules but was **not** built on the author's machine (the Docker engine was not running), so test `docker build` before relying on it.

## Data and credits

- Data: **CIC-IDS2017**, Canadian Institute for Cybersecurity. Sharafaldin, Lashkari and Ghorbani, "Toward Generating a New Intrusion Detection Dataset and Intrusion Traffic Characterization", ICISSP 2018. Used through the Hugging Face copy `rdpahalavan/CIC-IDS2017` (Apache-2.0).
- Created by **Sajid Hossain** ([sazid63.netlify.app](https://sazid63.netlify.app)).
