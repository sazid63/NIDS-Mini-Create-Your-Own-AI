import type { ReactNode } from 'react';
import type { Room } from './types';
import { TrainPlate, DeployPlate } from '../components/plates';
import { CopyButton, ReportCardPlate } from '../components/ui';
import { RESULTS } from './results';
import { SAMPLE_REQUEST } from './sample';
import trainRaw from '../../ai-project/train.py?raw';
import evalRaw from '../../ai-project/evaluate.py?raw';
import exportRaw from '../../ai-project/export_onnx.py?raw';
import predictRaw from '../../ai-project/predict.py?raw';
import serveRaw from '../../ai-project/serve.py?raw';
import dockerRaw from '../../ai-project/Dockerfile?raw';
import reqServeRaw from '../../ai-project/requirements-serve.txt?raw';

const SPACE_README = `---
title: NIDS Mini Guard
sdk: docker
app_port: 7860
---

# NIDS Mini guard
A small AI that spots network attacks.
`;

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="m-0 max-w-[68ch] list-disc space-y-2 pl-6 text-[1.0625rem]">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export const roomsB: Room[] = [
  {
    id: 3,
    slug: 'training',
    name: 'The Training Room',
    title: 'The Training Room',
    short: 'Training',
    promise: 'Your brain knows nothing yet. You teach it with a simple loop: guess, measure the mistake, work out what to blame, turn the knobs a little. Repeat thousands of times.',
    outcomes: [
      'A trained brain, saved to your computer.',
      'A diary of how the mistake score fell with practice.',
      'The best version of your brain, picked by practice quizzes.',
    ],
    plate: <TrainPlate />,
    caption: `The loop at the top is all of AI training. The line below is a real run of this exact code: the mistake score fell from ${RESULTS.epochs[0].loss.toFixed(3)} to ${RESULTS.epochs[RESULTS.epochs.length - 1].loss.toFixed(4)} over 15 rounds.`,
    words: [
      { term: 'Epoch (round)', says: 'One full trip through the whole learning pile. We do 15 rounds.' },
      { term: 'Batch (handful)', says: 'The brain does not look at 528,502 rows at once. It studies a handful of 512, learns a little, then takes the next handful.' },
      { term: 'Loss (mistake score)', says: 'One number that says how wrong the guesses were. Lower is better. Zero would be perfect.' },
      { term: 'Focal Loss', says: 'A stricter kind of mistake score. It almost ignores easy examples the brain already gets right, so it spends its effort on the hard, rare attacks.' },
      { term: 'Coach (optimizer)', says: 'The part that decides how to turn each of the 3.5 million knobs after every handful. Ours is called AdamW.' },
      { term: 'Learning rate', says: 'How big each knob-turn is. Too big and the brain overshoots. Too small and it learns too slowly. Ours starts small, grows, then shrinks again.' },
    ],
    steps: [
      {
        id: 's3-1',
        num: '1',
        title: 'Write the training program',
        why: 'This is the program that does the teaching. It has 7 parts. Part 5 is the heart: the four-step loop from the picture above.',
        code: {
          file: 'train.py',
          raw: trainRaw,
          says: {
            0: { says: 'The tools it borrows: PyTorch, our brain from model.py, a grading tool, and a tool that hands the data out in handfuls.', lines: [{ c: 'from model import ResFlowNet', s: 'Bring in the brain you wrote in the last room.' }, { c: 'DataLoader', s: 'Hands the data out in small handfuls.' }] },
            1: { says: 'Picks the engine. A graphics card does this maths far faster than the normal processor, but the processor works too. The seed makes the random parts repeatable.', lines: [{ c: '"cuda" if torch.cuda.is_available() else "cpu"', s: 'Use the graphics card if there is one, otherwise the processor.' }, { c: 'torch.manual_seed(42)', s: 'Make the "random" choices the same every time.' }] },
            2: { says: 'Loads the piles you made in Room 1. The learning pile is cut into handfuls of 512 and shuffled every round. The quiz pile is moved to the engine, ready for practice quizzes.', lines: [{ c: 'batch_size=512', s: 'Each handful has 512 rows.' }, { c: 'shuffle=True', s: 'Mix the rows up every round, so the brain cannot learn the order.' }] },
            3: { says: 'The stricter score-keeper. It first measures the normal mistake, then works out how sure the brain was of the right answer. If it was already very sure, the mistake shrinks towards zero. "gamma" says how strongly to ignore easy cases.', lines: [{ c: 'cross_entropy(...)', s: 'The normal mistake size for each row.' }, { c: 'torch.exp(-plain)', s: 'How sure the brain was of the right answer (0 to 1).' }, { c: '(1 - chance_right) ** gamma', s: 'Close to 0 when the brain was sure. That shrinks the easy ones.' }] },
            4: { says: 'Creates the brain, the mistake score, the coach and the plan. The plan raises the learning rate for a while, then lowers it to tiny steps at the end, so the brain settles nicely.', lines: [{ c: 'AdamW(..., lr=1e-3, weight_decay=1e-4)', s: 'The coach. lr is the step size. weight_decay stops the knobs growing too large.' }, { c: 'EPOCHS = 15', s: 'Fifteen rounds of practice.' }, { c: 'OneCycleLR', s: 'The plan: bigger steps first, tiny steps at the end.' }] },
            5: {
              says: 'The learning loop. For each handful: wipe old notes, guess and measure the mistake, find which knobs caused it, turn those knobs a little. Then repeat with the next handful, for all 15 rounds.',
              lines: [
                { c: 'coach.zero_grad()', s: '1. Wipe the notes from the last handful.' },
                { c: 'loss = loss_fn(brain(clues), answers)', s: '2. Guess, then measure how wrong.' },
                { c: 'loss.backward()', s: '3. Work out how much each knob is to blame.' },
                { c: 'coach.step()', s: '4. Turn every knob a tiny bit to fix it.' },
              ],
            },
            6: { says: 'After every round, the brain takes a practice quiz on the quiz pile. We use the Macro F1 grade (you will learn it in Room 4). If this is the best quiz score so far, we save the brain. That way we keep the best version, not just the last one. This part sits inside the round loop, which is why it is indented.', lines: [{ c: 'brain.eval()', s: 'Switch to quiz mode: no forgetting allowed.' }, { c: 'torch.no_grad()', s: 'Do not learn from the quiz. Just answer.' }, { c: 'torch.save(...)', s: 'Save the best brain to a file.' }] },
            7: { says: 'Writes a diary of every round. The website uses this diary to draw the real curve in the picture above.' },
          },
        },
        commands: [{ cmd: 'python train.py', says: 'Starts teaching. It prints one line per round. Each line shows the mistake score (should fall) and the quiz score (should climb, with some wobble).' }],
        see: {
          label: 'This is what our real run printed (first, middle and last rounds)',
          out: `Training on: cuda
Epoch  1/15  loss 0.0257  quiz score 0.6390  <- new best, saved!
Epoch  2/15  loss 0.0099  quiz score 0.6929  <- new best, saved!
Epoch  3/15  loss 0.0101  quiz score 0.6993  <- new best, saved!
Epoch  4/15  loss 0.0220  quiz score 0.6504
...
Epoch 10/15  loss 0.0042  quiz score 0.8021  <- new best, saved!
...
Epoch 15/15  loss 0.0025  quiz score 0.7734`,
        },
        stuck: 'Your numbers will not match exactly if you use a different computer, and that is fine. If it says "Training on: cpu" it will still work but takes much longer. To go faster, change EPOCHS = 15 to EPOCHS = 5.',
      },
      {
        id: 's3-2',
        num: '2',
        title: 'Read the results',
        why: 'Two things in the real log look strange at first. Both are normal.',
        extra: (
          <Bullets
            items={[
              <><strong>The mistake score jumped up at round 4 (0.0099 to 0.0220).</strong> That is the plan at work: the learning rate peaks around then, so the knob-turns are biggest and a little clumsy. After that the steps shrink and the score falls smoothly to 0.0025.</>,
              <><strong>The quiz score wobbles (0.80 at round 10, then 0.77).</strong> The quiz has a few very rare attacks, like 3 SQL injections. One right or wrong answer swings their grade a lot. That is why we save the best round, not the last.</>,
              <>Our run picked <strong>round 10</strong> (quiz score 0.8021), and saved that brain as <code className="font-mono text-[0.95em]">data/best_model.pth</code>.</>,
            ]}
          />
        ),
      },
    ],
    done: 'Your brain has learned. Now the scary part: the final exam.',
  },
  {
    id: 4,
    slug: 'testing',
    name: 'The Testing Room',
    title: 'The Testing Room',
    short: 'Testing',
    promise: 'Time for the exam. Your brain gets traffic it has never seen, and we grade it honestly, including the attacks it misses.',
    outcomes: [
      'An honest report card for all 15 kinds of traffic.',
      'Two grades, and a clear reason why the "big" one can fool you.',
      'A list of what your AI is bad at, and ideas to fix it.',
    ],
    plate: <ReportCardPlate />,
    caption: 'The real report card from this project, one bar per kind of traffic. Most kinds score above 90%. A few rare, tricky ones do not. Not sure what a name like DoS Hulk or SSH-Patator means? Room 1 explains all 15.',
    words: [
      { term: 'Exam pile', says: 'The 424,152 rows we locked away in Room 1. The brain has never seen them, so the score is honest.' },
      { term: 'Accuracy', says: 'The share of answers that were right. Careful: about 80% of the traffic is normal, so an AI that always said "normal" would already score about 80%.' },
      { term: 'Precision', says: 'When the AI shouts "attack!", how often is it right? Low precision means lots of false alarms.' },
      { term: 'Recall', says: 'Of all the real attacks, how many did it catch? Low recall means attacks sneak past.' },
      { term: 'Macro F1 (fair grade)', says: 'One grade that mixes precision and recall for each kind of traffic, then averages them so a rare attack counts just as much as normal traffic.' },
    ],
    steps: [
      {
        id: 's4-1',
        num: '1',
        title: 'Write the exam program',
        why: 'It loads your best saved brain, lets it answer every exam question, and compares its answers to the truth.',
        code: {
          file: 'evaluate.py',
          raw: evalRaw,
          says: {
            0: { says: 'The tools it borrows, including grading helpers from scikit-learn.', lines: [{ c: 'accuracy_score, f1_score, classification_report', s: 'Ready-made graders.' }] },
            1: { says: 'Loads the exam pile and the best brain you saved. The brain is set to exam mode, so it does no forgetting.', lines: [{ c: 'load_state_dict(torch.load(...))', s: 'Put the saved knob settings back into the brain.' }, { c: 'brain.eval()', s: 'Exam mode.' }] },
            2: { says: 'Gives the brain every exam row at once. It answers with 15 scores per row, and "argmax" picks the highest score as its guess.', lines: [{ c: '.argmax(dim=1)', s: 'Pick the kind with the highest score.' }] },
            3: { says: 'Works out the two big grades: accuracy and Macro F1.' },
            4: { says: 'Prints a report card for every kind of traffic, and saves it to a file so the website could draw the picture.' },
          },
        },
        commands: [{ cmd: 'python evaluate.py', says: 'Runs the final exam and prints the report card.' }],
        see: {
          label: 'This is our real report card',
          out: `Overall accuracy: 99.66%   (how many answers were right)
Macro F1 score:   80.73%   (fair grade: every attack kind counts the same)

                            precision    recall  f1-score   support
                    BENIGN       1.00      1.00      1.00    340668
                       Bot       0.56      0.60      0.58       293
                      DDoS       1.00      1.00      1.00     19204
             DoS GoldenEye       0.96      1.00      0.98      1544
                  DoS Hulk       0.99      1.00      0.99     34518
          DoS Slowhttptest       0.95      0.97      0.96       825
             DoS slowloris       0.97      0.99      0.98       870
               FTP-Patator       1.00      1.00      1.00      1190
                Heartbleed       1.00      1.00      1.00         2
              Infiltration       0.33      0.17      0.22         6
                  PortScan       0.99      1.00      0.99     23820
               SSH-Patator       0.87      1.00      0.93       885
  Web Attack - Brute Force       0.66      1.00      0.79       226
Web Attack - Sql Injection       0.67      0.67      0.67         3
          Web Attack - XSS       0.50      0.01      0.02        98`,
        },
      },
      {
        id: 's4-2',
        num: '2',
        title: 'Read the report card honestly',
        why: 'A good scientist shows where the AI fails, not just where it shines.',
        extra: (
          <Bullets
            items={[
              <><strong>99.66% accuracy looks amazing, but it is the easy grade.</strong> Most of the exam is normal traffic. The fair grade is Macro F1: <strong>{RESULTS.macroF1}%</strong>.</>,
              <><strong>The hard ones are the rare ones.</strong> Infiltration had only 6 exam rows and SQL injection had 3. One mistake moves their score a lot, and the brain simply saw very few examples of them.</>,
              <><strong>Web XSS is almost always called "Brute Force".</strong> In this dataset those two web attacks look very alike, and researchers who study it say the same. That is a limit of the data, not only of your brain.</>,
              <><strong>Ideas to improve it:</strong> train longer, give rare attacks extra weight, collect more examples of them, or try a bigger brain. Change one thing at a time and re-run the exam.</>,
              <><strong>A note on numbers.</strong> An earlier test of this project by its author reported 98.40% accuracy and 94.12% Macro F1 on a different version. The numbers on this page come from the exact code shown in this guide, so you should get results close to them.</>,
            ]}
          />
        ),
        stuck: 'Your scores may differ by a point or two on a different computer. Learning has a little randomness in it. A huge difference (like 20%) means a step was skipped. Re-run prepare_data.py and train.py.',
      },
    ],
    done: 'You know exactly how good your AI is, and where it is weak. Now let us put it to work.',
  },
  {
    id: 5,
    slug: 'deploy',
    name: 'The Launch Room',
    title: 'The Launch Room',
    short: 'Deploy',
    promise: 'A brain on your laptop helps only you. Here you pack it into one small file, give it a web address, and put it online so any program can ask it a question.',
    outcomes: [
      'One packed file, about 14 MB, that runs without PyTorch.',
      'A guard that answers in under a millisecond on a normal computer.',
      'A working web address, on your computer and ready to go online.',
    ],
    plate: <DeployPlate />,
    caption: 'Your packed brain sits behind a web address. Any program sends 78 numbers about one conversation, and gets back a verdict: allow or block.',
    words: [
      { term: 'Deploy', says: 'Put your finished AI somewhere that other people and programs can use it, not just your own laptop.' },
      { term: 'ONNX', says: 'A travel-friendly file format for AI brains. It is like putting your brain in a suitcase that opens on almost any computer, without needing PyTorch.' },
      { term: 'Web address (API)', says: 'A door in your program that other programs can knock on with a question and get an answer back.' },
      { term: 'Server', says: 'A computer that stays on and waits for questions. Your program runs on it.' },
      { term: 'Docker', says: 'A shipping box that holds your program and everything it needs, so it runs exactly the same on any computer.' },
    ],
    steps: [
      {
        id: 's5-1',
        num: '1',
        title: 'Pack the brain into one file',
        why: 'PyTorch is a heavy workshop. Once training is done we do not need the workshop, just the finished brain. ONNX packs it into a single light file. Then we check the packed brain gives the same answers as the original.',
        code: {
          file: 'export_onnx.py',
          raw: exportRaw,
          says: {
            0: { says: 'The tools it borrows. onnxruntime is the tool that can open and run ONNX files.' },
            1: { says: 'Loads your best brain and switches it to working mode.' },
            2: { says: 'Packs the brain into nids_mini.onnx. It needs one pretend row so it can follow the path numbers take through the brain. "dynamic_axes" says: the number of rows can change, so one flow or a thousand both work.', lines: [{ c: 'torch.randn(1, 78)', s: 'One pretend row of 78 random numbers.' }, { c: 'input_names / output_names', s: 'Names for the door in and the door out.' }, { c: 'dynamic_axes', s: 'Allow any number of rows at once.' }] },
            3: { says: 'Proves the packed brain matches the original. It gives both the same 8 pretend rows and prints the biggest difference. A tiny number (like 0.000002) means they behave identically.' },
          },
        },
        commands: [{ cmd: 'python export_onnx.py', says: 'Creates nids_mini.onnx, about 14 MB, and compares it to the original.' }],
        see: { label: 'You should see (the exact tiny number can differ)', out: 'Saved nids_mini.onnx\nBiggest difference between the two: 1.9073486328125e-06' },
        stuck: 'A yellow "DeprecationWarning" about the exporter is only a notice from PyTorch. Your file is fine. We chose the older exporter on purpose because the newer one crashes on some Windows screens.',
      },
      {
        id: 's5-2',
        num: '2',
        title: 'Use the packed brain like a real guard',
        why: 'This program needs only numpy and onnxruntime, no PyTorch. It opens the packed file, prepares a flow exactly the way training did, and gives a verdict. Preparing it the same way matters: a brain trained on squashed, rulered numbers gets confused by raw ones.',
        code: {
          file: 'predict.py',
          raw: predictRaw,
          says: {
            0: { says: 'The tools it borrows. Notice there is no PyTorch.' },
            1: { says: 'Opens the packed brain and the ruler numbers saved in Room 1.' },
            2: { says: 'A helper called check_flow. It takes the 78 raw numbers of one flow, squashes and rulers them the same way as training, asks the brain, turns the 15 scores into percentages, and returns the winning kind and how sure it is.', lines: [{ c: 'np.sign(x) * np.log1p(np.abs(x))', s: 'Same squash as in Room 1.' }, { c: '(x - mean) / scale', s: 'Same ruler as in Room 1.' }, { c: 'chance / chance.sum()', s: 'Turn scores into percentages that add up to 100%.' }] },
            3: { says: 'Tries it on four real flows we saved: one normal and three attacks. It shows ALLOW or BLOCK, the guess, and the real answer. This is the guard at work.' },
            4: { says: 'Times the brain alone. It warms up once, then answers 1,000 times in a row and shows the average speed.' },
          },
        },
        commands: [{ cmd: 'python predict.py', says: 'Runs the four example flows through your guard and times it.' }],
        see: {
          label: 'This is our real output',
          out: `ALLOW BENIGN         (100.0% sure)  real answer: BENIGN        took 1.480 ms
BLOCK DoS Hulk       (100.0% sure)  real answer: DoS Hulk      took 0.829 ms
BLOCK PortScan       (98.2% sure)  real answer: PortScan      took 1.863 ms
BLOCK SSH-Patator    (98.0% sure)  real answer: SSH-Patator   took 1.187 ms
Average brain speed: 0.755 ms per flow  (0.76 s for 1,000 flows)`,
        },
        extra: (
          <p className="m-0 max-w-[68ch] rounded-lg bg-white p-4 text-[1rem] ring-1 ring-line">
            <strong>How fast is that?</strong> About {RESULTS.msPerFlow} milliseconds per flow on our test computer, with no graphics card. That is over a thousand flows every second. The author measured 0.062 ms on a faster machine in an earlier test. Your speed depends on your computer.
          </p>
        ),
      },
      {
        id: 's5-3',
        num: '3',
        title: 'Give it a web address',
        why: 'Now other programs can talk to your guard. FastAPI builds the web address for us. We make two doors: /health ("are you alive?") and /predict ("is this flow safe?").',
        code: {
          file: 'serve.py',
          raw: serveRaw,
          says: {
            0: { says: 'The tools it borrows: FastAPI builds the web server, and pydantic checks the shape of incoming questions.' },
            1: { says: 'Loads the packed brain once, when the server starts, so every question is answered fast. "app" is the web server itself.' },
            2: { says: 'Describes what a question must look like: a list of 78 numbers called features.' },
            3: { says: 'The "are you alive?" door. Visit /health and it answers {"status": "ok"}. Hosting websites use this to check that your program is running.', lines: [{ c: '@app.get("/health")', s: 'Make a door at /health that you can visit.' }] },
            4: { says: 'The question door. It checks there are exactly 78 numbers, prepares them the same way as training, asks the brain, and answers with the verdict, how sure it is, and what to do: allow or block.', lines: [{ c: '@app.post("/predict")', s: 'Make a door at /predict that accepts questions.' }, { c: 'raise HTTPException(400, ...)', s: 'If the question is wrong, politely say so.' }] },
          },
        },
        commands: [{ cmd: 'python -m uvicorn serve:app --port 8000', says: 'Starts the web server. "serve:app" means "in the file serve.py, run the thing called app". Leave this window open while you use it.' }],
        see: { label: 'The terminal should say', out: 'INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)' },
        extra: (
          <div className="space-y-3">
            <ol className="m-0 max-w-[68ch] list-decimal space-y-2 pl-6 text-[1.0625rem]">
              <li>Open <code className="font-mono text-[0.95em]">http://127.0.0.1:8000/docs</code> in your web browser. FastAPI made a free test page for you.</li>
              <li>Click <strong>POST /predict</strong>, then <strong>Try it out</strong>.</li>
              <li>Paste the question below into the box and press <strong>Execute</strong>. It is 78 real numbers from a real DoS Hulk attack.</li>
            </ol>
            <div className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
                <span className="text-[0.95rem] font-bold">A real question to paste</span>
                <CopyButton text={SAMPLE_REQUEST} label="Copy question" />
              </div>
              <pre className="m-0 max-h-28 overflow-auto whitespace-pre-wrap break-all p-3 text-[0.8rem] [overflow-wrap:anywhere]">{SAMPLE_REQUEST}</pre>
            </div>
            <p className="m-0 max-w-[68ch]">The answer should look like this (we tested it):</p>
            <pre className="m-0 overflow-x-auto rounded-lg bg-[#0e1124] p-4 text-[0.88rem] text-[#cfe9e5]">{`{"verdict":"DoS Hulk","confidence":1.0,"action":"block"}`}</pre>
          </div>
        ),
        stuck: 'If it says the port is in use, something else is already using 8000. Change --port 8000 to --port 8001 and use 8001 in the address.',
      },
      {
        id: 's5-4',
        num: '4',
        title: 'Make a shorter shopping list',
        why: 'Your program works on your computer because you installed the right tools. A Docker box carries the program, the packed brain, and the tools together, so it runs the same anywhere. Our box is small because it needs no PyTorch.',
        code: {
          file: 'requirements-serve.txt',
          raw: reqServeRaw,
          says: { 1: { says: 'A much shorter shopping list, only what the finished guard needs. A short list means a small, quick box.' } },
        },
        extra: (
          <div className="space-y-4">
            <p className="m-0 max-w-[68ch]">Next comes the recipe for the box itself.</p>
          </div>
        ),
              },
      {
        id: 's5-4a',
        num: '4a',
        title: 'Install Docker (only needed for the shipping box)',
        why: 'Docker is the program that builds and runs shipping boxes. It is a separate download, and it is optional: you can skip Steps 5 and 6 and still have a working guard on your own computer.',
        extra: (
          <ol className="m-0 max-w-[68ch] list-decimal space-y-2 pl-6 text-[1.0625rem]">
            <li>Go to <strong>docker.com</strong>, open the Docker Desktop download page, and download the version for your computer (Windows, Mac or Linux).</li>
            <li>Run the installer and follow its questions. On Windows it may ask to restart your computer, and to turn on WSL 2. Say yes.</li>
            <li>Open <strong>Docker Desktop</strong> and wait until it says Docker is running.</li>
          </ol>
        ),
        commands: [{ cmd: 'docker --version', says: 'Checks the install worked. It should print a version number such as "Docker version 27.0.3".' }],
        stuck: 'If a Docker command says it cannot connect, Docker Desktop is not running yet. Open it and wait for the "running" message.',
      },
      {
        id: 's5-4b',
        num: '5',
        title: 'Pack it into a shipping box',
        why: 'Create a file called Dockerfile (no ending). A Dockerfile is a list of instructions for building the box, read from top to bottom. Each coloured part below is one instruction.',
        code: {
          file: 'Dockerfile',
          raw: dockerRaw,
          says: {
            1: { says: 'Start from a small, ready-made computer that already has Python installed. "slim" means it has no extras.', lines: [{ c: 'FROM python:3.12-slim', s: 'Begin with a tiny Python computer.' }] },
            2: { says: 'Create a normal user and work as them, not as the all-powerful administrator. Free hosting like Hugging Face Spaces asks for this, and it is safer anyway.', lines: [{ c: 'WORKDIR $HOME/app', s: 'Move into a folder called app inside the box.' }] },
            3: { says: 'Copy in the short shopping list, then install everything on it.', lines: [{ c: 'COPY ... requirements-serve.txt .', s: 'Copy the list into the box.' }, { c: 'RUN pip install ...', s: 'Install the tools inside the box.' }] },
            4: { says: 'Copy in the guard: the program, the packed brain, and the ruler numbers.' },
            5: { says: 'Open door number 7860 and start the web server. 7860 is the door that free hosting on Hugging Face expects.', lines: [{ c: 'EXPOSE 7860', s: 'This box will listen at door 7860.' }, { c: 'CMD [...]', s: 'The command to run when the box starts.' }] },
          },
        },
        commands: [
          { cmd: 'docker build -t nids-mini .', says: 'Builds the box and names it nids-mini. The dot means "use the files in this folder". The first time takes a few minutes.' },
          { cmd: 'docker run -p 8000:7860 nids-mini', says: 'Starts the box. "-p 8000:7860" connects door 8000 on your computer to door 7860 inside the box. Now try http://127.0.0.1:8000/docs again.' },
        ],
      },
      {
        id: 's5-5',
        num: '6',
        title: 'Put it online for free',
        why: 'Hugging Face Spaces can run a Docker box for free. Your Dockerfile already uses door 7860 and a normal user, which is what a Space expects. One more small file is needed: a README.md whose first lines tell the Space it is a Docker Space.',
        extra: (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
                <span className="text-[0.95rem] font-bold">Make a file called README.md with exactly this</span>
                <CopyButton text={SPACE_README} label="Copy" />
              </div>
              <pre className="m-0 overflow-x-auto p-3 text-[0.85rem]">{SPACE_README}</pre>
            </div>
            <p className="m-0 max-w-[68ch] text-[1rem]">The part between the two lines of dashes is read by the hosting site, not by people. "sdk: docker" says this is a Docker box, and "app_port: 7860" says which door to knock on.</p>
          <ol className="m-0 max-w-[68ch] list-decimal space-y-2 pl-6 text-[1.0625rem]">
            <li>Make a free account at <strong>huggingface.co</strong> (you do this yourself).</li>
            <li>Click <strong>New Space</strong>, give it a name, and choose <strong>Docker</strong> as the type.</li>
            <li>In the Space, open the <strong>Files</strong> tab, then <strong>Add file → Upload files</strong>. Upload: <code className="font-mono text-[0.95em]">Dockerfile</code>, the <code className="font-mono text-[0.95em]">README.md</code> from the box above, <code className="font-mono text-[0.95em]">serve.py</code>, <code className="font-mono text-[0.95em]">nids_mini.onnx</code>, <code className="font-mono text-[0.95em]">requirements-serve.txt</code>, and the file <code className="font-mono text-[0.95em]">data/meta.json</code> (keep it inside a folder called data).</li>
            <li>The Space builds your box by itself. Watch the <strong>Logs</strong> tab. When it says Running, your guard is online.</li>
            <li>Add <code className="font-mono text-[0.95em]">/docs</code> to the end of your Space\'s web address to try it, just like you did on your own computer.</li>
          </ol>
          </div>
        ),
        stuck: 'Free hosting may put your Space to sleep when nobody is using it, then wake it up when someone visits. The first visit after a sleep can be slow.',
      },
      {
        id: 's5-6',
        num: '7',
        title: 'What you built, and what next',
        why: 'You went from nothing to a trained, tested, deployed AI. That is the whole life of a real machine-learning project.',
        extra: (
          <Bullets
            items={[
              <>Make it better: give rare attacks extra weight, train longer, try a bigger or smaller brain, and compare using Macro F1.</>,
              <>Make it safer: a real guard would never rely on one AI alone. It would sit beside firewalls and other checks.</>,
              <>Make it yours: change the brain\'s size in model.py (try size=384 or size=768) and see how the knob count and the score change.</>,
            ]}
          />
        ),
      },
    ],
    done: 'You built it, tested it honestly, and launched it. Well done!',
  },
];
