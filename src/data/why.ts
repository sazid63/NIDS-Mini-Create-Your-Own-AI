// "Why do we need this?" for every code part, keyed by "file:part number".
// The explanation next to each part says WHAT it does; this says WHY it is there.

export const WHY: Record<string, string> = {
  'requirements.txt:1': 'Writing the maths and table tools ourselves would take months. Borrowing tools that other people already built and tested is how almost all real AI is made.',
  'requirements.txt:2': 'These live in a separate group because only the last room needs them. If an install fails later, you will know which group to look at.',

  'get_data.py:1': 'Downloading by hand means clicking around a website and moving files. A tool does it the same way every time, so your folder ends up exactly like ours.',
  'get_data.py:2': 'A computer needs the exact address of a file. One wrong letter and it finds nothing, so we write the address once, in one place, with clear names.',
  'get_data.py:3': 'An AI cannot learn without examples. We keep a copy on your own computer so you download only once, not every time you train.',

  'prepare_data.py:0': 'Each borrowed tool is one job we do not have to build ourselves.',
  'prepare_data.py:1': 'Before changing anything, look at it. Seeing the row count first tells you at once whether the file loaded properly.',
  'prepare_data.py:2': 'An AI should learn how an attack behaves, not who sent it. Addresses change from day to day, so memorising them would fail on new traffic. And the AI only understands numbers, so words must become numbers.',
  'prepare_data.py:3': 'One broken value can crash training or quietly spoil the maths. Cleaning first is far cheaper than hunting a mystery bug later.',
  'prepare_data.py:4': 'The AI answers in numbers, so the right answers must be numbers too. We keep the list of names so we can turn a number back into a name at the very end.',
  'prepare_data.py:5': 'A student who studies from the exam paper scores 100% and learns nothing. A secret exam pile is the only honest way to find out whether the AI really learned.',
  'prepare_data.py:6': 'If 90% of the examples say "normal", always guessing "normal" looks clever but catches no attacks. Trimming the huge piles makes the AI study the attacks properly. The exam pile is left alone so the score reflects real life.',
  'prepare_data.py:7': 'Learning works best when all clues are a similar size. Without this, clues measured in millions drown out clues measured in ones, and the AI would mostly ignore small but important clues. The ruler is worked out from the learning pile only, so the exam stays a secret.',
  'prepare_data.py:8': 'The next rooms are separate programs, so they need the results saved on disk. We also save the ruler, because the finished guard must prepare live traffic in exactly the same way.',

  'model.py:0': 'Building maths stages from nothing is slow and easy to get wrong. PyTorch gives us tested building blocks.',
  'model.py:1': 'One neat block that we can copy many times. The shortcut matters: in a deep stack, the early information fades away. Adding the original numbers back means each block only has to learn a small improvement.',
  'model.py:2': 'Stacking blocks gives the brain depth, which lets it spot complicated patterns. The sizes 78 in and 15 out are fixed by our data. The width 536 and the 6 blocks are chosen so the brain lands near 3.5 million knobs.',
  'model.py:3': 'Before you spend minutes training, check that the brain builds and the shapes fit. A mistake here costs seconds. Found later, it would cost a whole training run.',

  'train.py:0': 'Training needs data handling, grading and our brain, so we bring in all three.',
  'train.py:1': 'Training is billions of small sums. A graphics card does many at once, so it takes minutes instead of hours. The seed lets you repeat the experiment and get the same result.',
  'train.py:2': 'Handfuls are faster than looking at everything at once, and the small bit of noise actually helps the brain avoid memorising. Shuffling stops it from learning the order of the rows instead of the patterns.',
  'train.py:3': 'Our data has a few very common kinds and some very rare ones. A normal mistake score is satisfied by getting the common ones right. Focal Loss makes the brain care about the hard, rare cases, and those are often the dangerous attacks.',
  'train.py:4': 'The brain starts with random knobs, and the coach is what improves them. The plan takes careful steps, then bigger ones, then tiny ones, so the brain settles on a good answer instead of bouncing around.',
  'train.py:5': 'This loop IS the learning. Each pass makes the guesses a tiny bit less wrong. We wipe the old notes first, because otherwise blame from the last handful would mix into this one.',
  'train.py:6': 'A brain can look brilliant on data it studied and fail on new data. The quiz shows real progress. Saving the best version protects us if later rounds get worse.',
  'train.py:7': 'A saved diary lets you see whether learning worked. If something goes wrong, it shows which round it went wrong in.',

  'evaluate.py:0': 'The exam needs the brain, the data and some ready-made graders.',
  'evaluate.py:1': 'We test the saved best brain, not whatever happens to be in memory, so the exam is the same every time.',
  'evaluate.py:2': 'Answering every question in one go is quick. Exam mode switches off the random forgetting used in training, so the answers are steady.',
  'evaluate.py:3': 'One number can hide failures. Accuracy alone would look great even if the AI missed every rare attack, so we also compute the fair grade.',
  'evaluate.py:4': 'An average hides where the AI is weak. A report card per kind of traffic shows exactly what to fix next.',

  'export_onnx.py:0': 'We need the brain, plus the tool that can open and run the packed file.',
  'export_onnx.py:1': 'Working mode switches off forgetting. Otherwise the packed brain would behave differently every time you asked it.',
  'export_onnx.py:2': 'PyTorch is big and slow to install. One small ONNX file runs in a tiny tool on almost any computer, which makes it easy to put inside a web service.',
  'export_onnx.py:3': 'Packing can quietly change answers. Giving both brains the same input and comparing proves the packed one is really the same brain.',

  'predict.py:0': 'Only numpy and onnxruntime. Leaving out PyTorch keeps the finished guard small and quick to start.',
  'predict.py:1': 'Opening the brain once at the start is much faster than opening it again for every flow.',
  'predict.py:2': 'The brain learned from squashed, rulered numbers. Feed it raw numbers and it gives nonsense. Live traffic must be prepared in exactly the same way as the training data.',
  'predict.py:3': 'Trying real examples with known answers is the simplest proof that the whole chain works.',
  'predict.py:4': 'A guard that is too slow cannot keep up with real traffic. Measuring tells you whether it is fast enough.',

  'serve.py:0': 'FastAPI builds the web server for us, so we do not have to write network code by hand.',
  'serve.py:1': 'Loading the brain once, when the server starts, means every question after that is answered fast.',
  'serve.py:2': 'Checking the shape of each question keeps garbage out of the brain and gives the sender a clear message.',
  'serve.py:3': 'Hosting services knock on this address to check your program is alive, and restart it if it is not.',
  'serve.py:4': 'This is the whole point of deploying: any other program can ask the guard a question and get an action back.',

  'requirements-serve.txt:1': 'Fewer tools make a smaller, faster, cheaper box. The guard does not need PyTorch or pandas, so leaving them out keeps it light.',

  'Dockerfile:1': 'Starting from a ready-made computer saves installing Python ourselves. "Slim" keeps it small.',
  'Dockerfile:2': 'If a program is ever hacked, it only gets the powers of a normal user. Free hosting sites also require this.',
  'Dockerfile:3': 'Doing this before copying our own code lets Docker remember the installed tools, so rebuilding after a small change takes seconds.',
  'Dockerfile:4': 'The box only contains what we copy in. So we must copy in every file the guard needs, and nothing else.',
  'Dockerfile:5': 'The outside world needs to know which door to knock on, and the box needs to know what to run when it starts.',
};
