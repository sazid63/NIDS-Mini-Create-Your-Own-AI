# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Complete beginners, from about age 12 up, who have never written a machine-learning program. They sit at a laptop with a terminal open, following along step by step and copying commands. They need to feel "I can do this" and finish with a working AI of their own.

## Product Purpose
NIDS Mini is a guided masterclass that walks a beginner through building a real AI network intrusion detector ("a guard that spots hackers in internet traffic") from raw data to a deployed web service. Success: the learner runs every script, gets a trained model of about 3.5 million parameters, tests it on traffic it never saw, and puts it behind a web address.

## Positioning
Every phase explains the why, the commands, and each part of the code in everyday words, and the guide ships with a real, tested project (`ai-project/`) trained on the real CIC-IDS2017 dataset, so the results a learner sees are the results the guide shows.

## Operating Context
Learner works in a terminal (Python, PyTorch, scikit-learn, ONNX Runtime, FastAPI). Phases: Data, Brain, Training, Testing, Deploy. Real dataset: CIC-IDS2017 flow table (2,827,677 rows, 78 clues per row, 15 traffic kinds) from the Hugging Face mirror `rdpahalavan/CIC-IDS2017` (Apache-2.0), originally by the Canadian Institute for Cybersecurity.

## Capabilities and Constraints
- Zero jargon: any necessary technical word is explained in plain language right where it appears and collected in a per-phase glossary.
- Every command and code part has a plain-language explanation; long code is visually broken into numbered, colour-coded parts.
- Each phase has its own illustration that shows what that phase does.
- Model is ResFlowNet: 78 inputs, 6 shortcut blocks of width 536, 15 outputs, 3,518,319 parameters (counted, not estimated).
- Measured on the real data in this project: 99.66% overall accuracy, 80.7% Macro F1, ONNX file about 14 MB, about 0.75 ms per flow on a CPU (author's own faster-machine test earlier reported 0.062 ms).
- Honest limits are stated: rare attack kinds (Infiltration, XSS, Bot) are hard; web-attack kinds look alike in this dataset.
- Stack: existing React 19 + TypeScript + Tailwind v4 + Vite single-page app; Python project lives in `ai-project/`.

## Brand Commitments
Author credit to Sajid Hossain (https://sazid63.netlify.app) stays in the footer. Name: "NIDS Mini".

## Evidence on Hand
Real results from running `ai-project/` on the full dataset (`data/history.json`, `data/report.json`). No testimonials, user counts, or other claims exist and none may be invented.

## Product Principles
1. A beginner is never left holding a word they do not know.
2. Show before telling: each phase opens with a picture of what happens.
3. Every number on the site comes from a real run of the real code.
4. Small steps: one command, one idea, one explanation at a time.
5. Say honestly what the AI cannot do yet.

## Accessibility & Inclusion
Readable by young learners and non-native English readers: short sentences, high contrast, large tap targets, keyboard-operable, respects reduced motion.
