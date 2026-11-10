# NIDS Mini: a beginner's guide to building an AI guard

This repository is an **educational resource**, not a finished product. It is a step-by-step guide (a website) that teaches a complete beginner, from about age 12, to build a small AI called NIDS Mini **by themselves**: an AI with 3.5 million adjustable knobs that spots network attacks, trained on real data.

Nothing here has to be run to use the guide. The learner follows the guide, installs the software it tells them to install, writes the files, and builds NIDS Mini on their own computer.

## What the guide teaches

Six rooms, in order. Each room has an illustration, a plain-language glossary, numbered steps, every command explained, and every code file cut into colour-coded parts that say **what** the part does and **why** it is needed.

0. **Start here**: install Python, a code editor, a private toolbox, and the tools.
1. **Data Room**: download real traffic records (CIC-IDS2017), clean them, split them into learn, quiz and exam piles.
2. **Brain Room**: build the neural network (78 inputs, 6 shortcut blocks, 15 outputs, 3,518,319 knobs).
3. **Training Room**: Focal Loss, the AdamW coach, 15 rounds of practice, keep the best brain.
4. **Testing Room**: an honest exam with accuracy, precision, recall and Macro F1, including where the AI is weak.
5. **Launch Room**: pack the brain as ONNX, give it a web address with FastAPI, optionally ship it in Docker and put it online.

## What is in this repository

| Folder | What it is |
| --- | --- |
| `src/` | The guide website (React, TypeScript, Tailwind CSS, Vite). |
| `ai-project/` | Reference copies of the Python files the guide teaches, so a learner can compare their own files. The website reads its code samples from these files. |

The numbers quoted in the guide (99.66% accuracy, 80.7% Macro F1, 3,518,319 parameters) come from a real run of those files on the full dataset.

## Read the guide

```bash
npm install
npm run dev
```

## Data and credits

- Data: **CIC-IDS2017**, Canadian Institute for Cybersecurity. Sharafaldin, Lashkari and Ghorbani, "Toward Generating a New Intrusion Detection Dataset and Intrusion Traffic Characterization", ICISSP 2018. Used through the Hugging Face copy `rdpahalavan/CIC-IDS2017` (Apache-2.0).
- Created by **Sajid Hossain** ([sazid63.netlify.app](https://sazid63.netlify.app)).
