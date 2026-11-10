import type { Room } from './types';
import { WelcomePlate, DataPlate, BrainPlate } from '../components/plates';
import reqRaw from '../../ai-project/requirements.txt?raw';
import getDataRaw from '../../ai-project/get_data.py?raw';
import prepRaw from '../../ai-project/prepare_data.py?raw';
import modelRaw from '../../ai-project/model.py?raw';

const KINDS: [string, string, string][] = [
  ['BENIGN', 'Normal, everyday traffic. The good guys.', '2,271,122'],
  ['DoS Hulk', 'Floods a website with requests until it falls over.', '230,123'],
  ['PortScan', 'Knocks on every door of a computer to see which ones are open.', '158,804'],
  ['DDoS', 'Lots of computers flood one target at the same time.', '128,025'],
  ['DoS GoldenEye', 'Another way of flooding a website.', '10,293'],
  ['FTP-Patator', 'Keeps guessing passwords for a file server.', '7,935'],
  ['SSH-Patator', 'Keeps guessing passwords for remote login.', '5,897'],
  ['DoS slowloris', 'Holds connections open very slowly to clog a server.', '5,796'],
  ['DoS Slowhttptest', 'Another slow way to clog a server.', '5,499'],
  ['Bot', 'An infected computer taking orders from a hidden boss.', '1,956'],
  ['Web Attack - Brute Force', 'Guesses the password of a website login.', '1,507'],
  ['Web Attack - XSS', 'Sneaks harmful code into a web page.', '652'],
  ['Infiltration', 'Someone who is already inside moves around quietly.', '36'],
  ['Web Attack - Sql Injection', "Tricks a website's database into leaking.", '21'],
  ['Heartbleed', 'Steals secrets through a bug in a security tool.', '11'],
];

function KindsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <table className="w-full border-collapse text-left text-[0.95rem]">
        <caption className="border-b border-line bg-gallery/60 px-4 py-2.5 text-left text-[0.95rem] text-ink-2">The 15 kinds of traffic in the table, and how many rows of each there are. Some are very rare. Remember that, it matters later.</caption>
        <tbody>
          {KINDS.map(([name, says, n]) => (
            <tr key={name} className="border-b border-line last:border-b-0">
              <th scope="row" className="w-[34%] px-4 py-2 align-top font-bold">{name}</th>
              <td className="px-2 py-2 align-top">{says}</td>
              <td className="tabular px-4 py-2 text-right align-top font-semibold">{n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Folder() {
  const files: [string, string][] = [
    ['get_data.py', 'Room 1: downloads the real traffic table'],
    ['prepare_data.py', 'Room 1: cleans it and makes three piles'],
    ['model.py', 'Room 2: the brain'],
    ['train.py', 'Room 3: teaches the brain'],
    ['evaluate.py', 'Room 4: the final exam'],
    ['export_onnx.py', 'Room 5: packs the brain into one file'],
    ['predict.py', 'Room 5: uses the packed brain'],
    ['serve.py', 'Room 5: gives it a web address'],
    ['Dockerfile', 'Room 5: the shipping box'],
  ];
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="m-0 mb-2 font-mono text-[0.95rem] font-bold">nids-mini/</p>
      <ul className="m-0 list-none space-y-1 p-0 text-[0.95rem]">
        <li className="font-mono">requirements.txt <span className="font-sans text-ink-2">the shopping list of tools (next step)</span></li>
        {files.map(([f, d]) => (
          <li key={f} className="font-mono">{f} <span className="font-sans text-ink-2">{d}</span></li>
        ))}
        <li className="font-mono">data/ <span className="font-sans text-ink-2">made for you while you work: the table, the piles, the saved brain</span></li>
      </ul>
    </div>
  );
}

export const roomsA: Room[] = [
  {
    id: 0,
    slug: 'start',
    name: 'Start here',
    title: 'Hello! Let us build an AI guard.',
    short: 'Start here',
    promise: 'In five rooms you will build a real AI (NIDS stands for Network Intrusion Detection System, which just means a guard for network traffic) that watches internet traffic and shouts when it sees an attack. You will train it, test it, and put it on the web.',
    outcomes: [
      'A real AI with 3,518,319 adjustable knobs that you trained yourself.',
      'A test score on traffic it has never seen before.',
      'A web address that any program can ask: "is this traffic safe?"',
    ],
    plate: <WelcomePlate />,
    caption: 'This is the whole project in one picture. Traffic arrives. The AI guard looks at each piece. Safe traffic goes through to the server. Attacks are stopped.',
    words: [
      { term: 'AI', says: 'A program that learns from examples instead of being told exact rules. Show it thousands of safe and bad messages and it works out the difference by itself.' },
      { term: 'Network traffic', says: 'The messages computers send each other, like when you open a web page. Each conversation between two computers is called a flow.' },
      { term: 'Attack', says: 'When someone sends traffic to break in, guess passwords, or flood a computer so it cannot answer real people.' },
      { term: 'Terminal', says: 'A window where you type commands to your computer instead of clicking. On Windows, search for "Command Prompt". On Mac, search for "Terminal".' },
      { term: 'Python', says: 'The programming language we use. It reads almost like English, and almost every AI project uses it.' },
    ],
    steps: [
      {
        id: 's0-1',
        num: '1',
        title: 'Check that Python is installed',
        why: 'Python runs every program in this guide. You need version 3.10 or newer. We tested everything with Python 3.14.',
        commands: [{ cmd: 'python --version', says: 'Asks your computer which Python it has. It should print something like "Python 3.12.4". If it says "not found", download Python from python.org, install it, then close and reopen the terminal.' }],
        stuck: 'On some Macs and Linux computers the command is python3 instead of python. If python does not work, use python3 everywhere in this guide.',
      },
      {
        id: 's0-1b',
        num: '1b',
        title: 'Get a place to write code',
        why: 'You will create about nine small text files. Any plain text editor works, but a code editor colours the words and makes mistakes easier to spot. Visual Studio Code is free and popular: download it from code.visualstudio.com, install it, then use File, Open Folder to open your nids-mini folder (you make that folder in the next step). To make a file, click the New File icon, type the file name (for example model.py), and paste the code in.',
        stuck: 'Notepad also works if you save each file with the exact name, including the ending (.py), and choose "All files" as the type so Windows does not add .txt.',
      },
      {
        id: 's0-2',
        num: '2',
        title: 'Make a project folder with its own private toolbox',
        why: 'A virtual environment is a private toolbox just for this project. It keeps the tools you install here from mixing with anything else on your computer.',
        commands: [
          { cmd: 'mkdir nids-mini', says: 'Makes a new empty folder called nids-mini.' },
          { cmd: 'cd nids-mini', says: 'Walks into that folder. Every command from now on runs inside it.' },
          { cmd: 'python -m venv venv', says: 'Builds the private toolbox and names it venv. It takes a few seconds.' },
          { cmd: 'venv\\Scripts\\activate', says: 'WINDOWS: opens the toolbox. You will see (venv) appear at the start of your line.' },
          { cmd: 'source venv/bin/activate', says: 'MAC or LINUX: does the same thing. Use this one instead of the Windows line.' },
        ],
        stuck: 'On Windows PowerShell you may see a red message saying scripts are disabled. Easy fix: use the Command Prompt window instead of PowerShell, and the activate command will work.',
      },
      {
        id: 's0-3',
        num: '3',
        title: 'Install the tools',
        why: 'Our programs borrow ready-made tools written by other people, like PyTorch (builds the AI brain) and pandas (handles big tables). A "requirements" file is a shopping list that pip, Python\'s tool-fetcher, reads and installs in one go.',
        code: {
          file: 'requirements.txt',
          raw: reqRaw,
          says: {
            1: {
              says: 'The tools for Rooms 1 to 4. You only need to write the tool names. Lines that start with # are notes for humans and Python ignores them.',
              lines: [
                { c: 'torch', s: 'PyTorch. The workshop where we build and train the AI brain.' },
                { c: 'numpy', s: 'Fast maths on big lists of numbers.' },
                { c: 'pandas', s: 'Opens and cleans big tables, like a super spreadsheet.' },
                { c: 'pyarrow', s: 'Lets pandas read the compact file the data comes in.' },
                { c: 'scikit-learn', s: 'Handy helpers for splitting data and grading the AI.' },
                { c: 'huggingface_hub', s: 'Downloads the data from the website where it is kept.' },
              ],
            },
            2: {
              says: 'The tools for Room 5, when we pack the brain and give it a web address.',
              lines: [
                { c: 'onnx / onnxruntime', s: 'Pack the brain into one travel-friendly file, and run that file.' },
                { c: 'fastapi / uvicorn', s: 'Build the web address, and run the little web server.' },
              ],
            },
          },
        },
        commands: [{ cmd: 'pip install -r requirements.txt', says: 'Tells pip: "read the shopping list in requirements.txt and install every tool on it". PyTorch is a big download, so this can take several minutes. That is normal.' }],
        see: { label: 'When it finishes, the last line should say', out: 'Successfully installed torch-... numpy-... pandas-... (and more)' },
      },
      {
        id: 's0-4',
        num: '4',
        title: 'Meet your folder',
        why: 'By the end you will have these files. You make each one in the room where it is used, so do not worry about them yet. Prefer not to type? The finished files are in the ai-project folder of this guide\'s repository.',
        extra: <Folder />,
      },
      {
        id: 's0-5',
        num: '5',
        title: 'How to read each room',
        why: 'Every room follows the same pattern, so you always know where you are.',
        extra: (
          <ol className="m-0 max-w-[68ch] list-decimal space-y-2 pl-6 text-[1.0625rem]">
            <li>A <strong>picture</strong> shows what the room does.</li>
            <li><strong>Words to know</strong> explains every tricky word in everyday language.</li>
            <li><strong>Steps</strong> tell you what to type. Each command says what it does.</li>
            <li>Long code is cut into <strong>numbered, colour-coded parts</strong>. The part and its explanation share a colour and a number.</li>
            <li><strong>You should see</strong> shows what your screen should look like after. If yours matches, you are right on track.</li>
          </ol>
        ),
      },
    ],
    done: 'Your tools are ready. Time to meet the data.',
  },
  {
    id: 1,
    slug: 'data',
    name: 'The Data Room',
    title: 'The Data Room',
    short: 'Data',
    promise: 'An AI learns from examples. Here you get 2.8 million real examples of internet traffic, some safe and some attacks, and get them ready to learn from.',
    outcomes: [
      'The real traffic table (a public dataset called CIC-IDS2017) downloaded to your computer.',
      'Every row turned into 78 clean numbers.',
      'Three piles: one to learn from, one for practice quizzes, one for the final exam.',
    ],
    plate: <DataPlate />,
    caption: 'Real data is messy. We fix it, put every number on the same ruler, then split it into three piles: Learn, Quiz and Exam.',
    words: [
      { term: 'Flow', says: 'One conversation between two computers, from "hello" to "goodbye". Each row of our table is one flow.' },
      { term: 'Clue', says: 'One fact about a flow, such as how long it lasted or how many messages were sent. We use 78 clues per flow. (Grown-ups call these "features".)' },
      { term: 'Answer label', says: 'The correct answer for each row: normal, or the name of the attack. The AI learns by comparing its guesses to these.' },
      { term: 'Ruler (scaling)', says: 'Some clues are tiny (1) and some are huge (100,000,000). We squash and stretch them so every clue sits on the same ruler, or the giants would bully the small ones.' },
      { term: 'Three piles (split)', says: 'Learn pile: the AI studies it. Quiz pile: checks progress while learning. Exam pile: kept secret until the very end, like a final exam.' },
    ],
    steps: [
      {
        id: 's1-1',
        num: '1',
        title: 'Meet the data',
        why: (
          <>
            The data is called <strong>CIC-IDS2017</strong>. Researchers at the Canadian Institute for Cybersecurity built a practice network, then launched real attacks on it for five days while recording every conversation. We use a copy kept on the Hugging Face website (Apache-2.0 licence): {`2,827,677`} rows, 15 kinds of traffic.
          </>
        ),
        extra: <KindsTable />,
      },
      {
        id: 's1-2',
        num: '2',
        title: 'Download the data',
        why: 'This small program fetches the table once and stores it in a data folder. It is about 370 MB, so give it a few minutes.',
        code: {
          file: 'get_data.py',
          raw: getDataRaw,
          says: {
            1: { says: 'Brings in a tool that knows how to download files from the Hugging Face website.', lines: [{ c: 'from huggingface_hub import hf_hub_download', s: 'Borrow the "download a file" tool.' }] },
            2: { says: 'Says where the file lives. Think of REPO as the name of the shelf and FILE as the name of the book on it.' },
            3: { says: 'Does the download and saves it inside a folder called data.', lines: [{ c: 'local_dir="data"', s: 'Keep the file in a folder named data.' }, { c: 'print(...)', s: 'Shows you where the file was saved.' }] },
          },
        },
        commands: [{ cmd: 'python get_data.py', says: 'Runs the program you just made. The download starts.' }],
        see: { label: 'When it is done you should see a line like this', out: 'Saved to: ...\\data\\Network-Flows\\CICIDS_Flow.parquet' },
        stuck: 'If it stops half way, run the same command again. It picks up where it left off.',
      },
      {
        id: 's1-3',
        num: '3',
        title: 'Clean the data and make three piles',
        why: 'This is the longest program in the guide, so it is split into 8 colour parts. Read them top to bottom: each one does one small job.',
        code: {
          file: 'prepare_data.py',
          raw: prepRaw,
          says: {
            0: {
              says: 'The tools this file borrows.',
              lines: [
                { c: 'numpy as np / pandas as pd', s: 'Maths on number lists, and tables. "as np" just gives them short nicknames.' },
                { c: 'train_test_split', s: 'A tool that splits a table into piles for us.' },
              ],
            },
            1: { says: 'Opens the big table. A DataFrame (df) is just a table in Python\'s memory. It then says how many rows it found.', lines: [{ c: 'pd.read_parquet(...)', s: 'Read the downloaded table file.' }, { c: 'len(df)', s: 'How many rows the table has.' }] },
            2: { says: 'Throws away the columns that say who is talking and when, because the AI could cheat by memorising an attacker\'s address. Turns the words tcp, udp, other into the numbers 0, 1, 2. What is left is 78 clues plus the answer label.', lines: [{ c: 'df.drop(columns=[...])', s: 'Remove these columns.' }, { c: '.map({"tcp": 0, ...})', s: 'Swap each word for a number.' }] },
            3: { says: 'Deletes any row with a broken value, like "infinity" or an empty cell, because the AI would crash on them. This copy of the data happened to be tidy already, so nothing is removed. Real data is not always that kind, so we keep this safety net.', lines: [{ c: '.replace([np.inf, -np.inf], np.nan)', s: 'Turn "infinity" into "empty".' }, { c: '.dropna()', s: 'Delete every row that has an empty cell.' }] },
            4: { says: 'The AI only understands numbers, so each attack name gets a number from 0 to 14. "classes" is the list of 15 names in A to Z order. "X" is the 78 clues and "y" is the answers.' },
            5: { says: 'Splits the rows into three piles: 70% to learn from, 15% for practice quizzes, 15% for the final exam. "stratify" makes sure even the rarest attack appears in every pile. "random_state=42" makes the shuffle repeatable, so you get the same piles as we did.', lines: [{ c: 'test_size=0.30', s: 'Set aside 30% (we split that in half again: quiz and exam).' }, { c: 'stratify=y', s: 'Keep the same mix of attack kinds in every pile.' }] },
            6: { says: 'Normal traffic has over 2 million rows, but Heartbleed has only 11. If the AI saw mostly normal traffic it would learn to say "normal" every time. So in the learning pile only, we keep at most 150,000 rows of any one kind. The exam pile stays natural, like real life.', lines: [{ c: 'len(rows) > 150_000', s: 'Is this kind too common?' }, { c: 'rng.choice(rows, 150_000, replace=False)', s: 'If yes, pick 150,000 of them at random.' }] },
            7: { says: 'Two tricks make the numbers friendly. First, "squash" shrinks giant numbers using a logarithm, but keeps their order. Second, the ruler: every clue is shifted so its average is 0 and stretched so its spread is 1. We work out the ruler from the learning pile only, then use it on all piles, like grading everyone with the same ruler.', lines: [{ c: 'np.log1p(np.abs(a))', s: 'Shrink big numbers. 1 stays small, 100,000,000 becomes about 18.' }, { c: '(squash(a) - mean) / scale', s: 'Slide to average 0, then stretch to spread 1.' }, { c: 'scale[scale == 0] = 1.0', s: 'Never divide by zero.' }] },
            8: { says: 'Saves everything for the next rooms: the three piles, the ruler numbers, and four real example flows we will use at the end. Then it prints how many rows are in each pile.', lines: [{ c: 'np.savez_compressed(...)', s: 'Save the piles in one compact file.' }, { c: 'json.dump(...)', s: 'Save the ruler numbers and the attack names.' }] },
          },
        },
        commands: [{ cmd: 'python prepare_data.py', says: 'Runs all 8 parts in order. It may take a minute or two because there are millions of rows.' }],
        see: { label: 'You should see these three lines', out: 'Loaded 2,827,677 rows\nNumber of clues per row: 78\nTraining rows: 528502 | Practice-quiz rows: 424152 | Exam rows: 424152' },
        stuck: 'If you get "No such file or directory", you skipped the download step, or you are in the wrong folder. Run get_data.py first, from inside nids-mini.',
      },
    ],
    done: 'Your data is ready: 78 clean clues per row, in three piles.',
  },
  {
    id: 2,
    slug: 'brain',
    name: 'The Brain Room',
    title: 'The Brain Room',
    short: 'Brain',
    promise: 'Now you build the thinking part. It is a stack of simple maths stages with shortcuts, and it has 3,518,319 knobs that practice will turn.',
    outcomes: [
      'A brain called ResFlowNet, written in about 40 lines.',
      'A count showing it really has 3.5 million knobs.',
      'A test run showing it turns 78 clues into 15 scores.',
    ],
    plate: <BrainPlate />,
    caption: '78 clues go in. They pass through a start stage and six blocks. Each block has a shortcut that lets the clues skip ahead. 15 scores come out, one for each kind of traffic. The highest score is the guess.',
    words: [
      { term: 'Neural network', says: 'A stack of simple maths stages. Each stage mixes the numbers it receives and passes them on. With the right settings the stack can recognise patterns.' },
      { term: 'Knob (parameter)', says: 'One adjustable number inside the brain. Learning means turning millions of knobs a tiny bit at a time. Ours has 3,518,319.' },
      { term: 'Layer', says: 'One stage that mixes its input numbers using its knobs.' },
      { term: 'Shortcut', says: 'A bypass that carries the original numbers around a block and adds them back in. It stops the brain from forgetting the original clues in a deep stack.' },
      { term: 'Tidy, gate, forget', says: 'Three helper steps. Tidy keeps numbers from growing wild. Gate lets only positive numbers through. Forget randomly ignores a few numbers while learning, so the brain cannot just memorise.' },
    ],
    steps: [
      {
        id: 's2-1',
        num: '1',
        title: 'Write the brain',
        why: 'This file describes the brain. It does not learn yet. It is the empty shape, like a building with all the dials set to random. Three parts: one block, the whole stack, and a knob counter.',
        code: {
          file: 'model.py',
          raw: modelRaw,
          says: {
            0: { says: 'Borrows PyTorch. "nn" is its toolbox of ready-made brain stages.', lines: [{ c: 'import torch.nn as nn', s: 'Get the box of brain parts, and call it nn for short.' }] },
            1: {
              says: 'One thinking block. It mixes the clues, tidies them, opens the gate, mixes again, tidies again, then adds the original clues back in. That last add is the shortcut.',
              lines: [
                { c: 'nn.Linear(size, size)', s: 'A mixing layer. This is where the knobs live.' },
                { c: 'nn.BatchNorm1d(size)', s: 'The "tidy" step: keeps numbers in a friendly range.' },
                { c: 'nn.Dropout(forget)', s: 'The "forget" step: randomly ignores 10% of numbers while learning.' },
                { c: 'torch.relu(...)', s: 'The "gate": negative numbers become 0, positive numbers pass.' },
                { c: 'out + x', s: 'The shortcut: add the original input back in.' },
              ],
            },
            2: {
              says: 'The whole brain. A start stage turns 78 clues into 536 "thoughts". Then six blocks in a row. Then a finish stage turns 536 thoughts into 15 scores. "forward" is the path the numbers take.',
              lines: [
                { c: 'n_clues=78', s: 'How many clues come in.' },
                { c: 'size=536', s: 'How many thoughts each block holds. A wider brain can learn more, but is bigger.' },
                { c: 'n_blocks=6', s: 'How many blocks are stacked.' },
                { c: 'n_kinds=15', s: 'How many kinds of traffic it chooses between.' },
              ],
            },
            3: { says: 'Only runs when you type python model.py. It builds the brain, adds up all its knobs, and feeds it 4 pretend rows to prove it works. The "if __name__" line just means "only do this when this file is run directly".' },
          },
        },
        commands: [{ cmd: 'python model.py', says: 'Builds the brain, counts its knobs, and tests it on 4 made-up rows.' }],
        see: { label: 'You should see', out: 'Total parameters: 3,518,319\nTest run with 4 fake rows -> torch.Size([4, 15])' },
        stuck: '"ModuleNotFoundError: torch" means PyTorch is not installed in this toolbox. Check that (venv) shows at the start of your line, then run pip install -r requirements.txt again.',
      },
      {
        id: 's2-2',
        num: '2',
        title: 'Where do 3,518,319 knobs come from?',
        why: 'No magic, just counting. Each mixing layer has one knob for every pair of (number in, number out), plus one extra per output. Here is the sum.',
        extra: (
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <table className="tabular w-full border-collapse text-left text-[0.95rem]">
              <thead>
                <tr className="border-b border-line bg-gallery/60"><th className="px-4 py-2">Piece</th><th className="px-4 py-2">Sum</th><th className="px-4 py-2 text-right">Knobs</th></tr>
              </thead>
              <tbody>
                {[
                  ['Start stage', '78 × 536 + 536, plus 1,072 for tidying', '43,416'],
                  ['One block', '2 mixing layers × (536 × 536 + 536), plus tidying', '577,808'],
                  ['Six blocks', '6 × 577,808', '3,466,848'],
                  ['Finish stage', '536 × 15 + 15', '8,055'],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-b border-line"><th scope="row" className="px-4 py-2 font-bold">{a}</th><td className="px-4 py-2">{b}</td><td className="px-4 py-2 text-right">{c}</td></tr>
                ))}
                <tr className="bg-[#efeaff]"><th scope="row" className="px-4 py-2 font-bold">Total</th><td className="px-4 py-2" /><td className="px-4 py-2 text-right font-extrabold">3,518,319</td></tr>
              </tbody>
            </table>
          </div>
        ),
      },
    ],
    done: 'You have a brain. It knows nothing yet. In the next room you teach it.',
  },
];
