import { useState } from 'react';
import {
  ShieldAlert,
  Terminal,
  Code2,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';

import introOverviewImg from './assets/images/nids_intro_overview_1794256074574.jpg';
import dataCleaningImg from './assets/images/data_cleaning_pipeline_1794254677033.jpg';
import neuralArchImg from './assets/images/neural_network_architecture_1794254676773.jpg';
import trainingLossImg from './assets/images/training_loss_graph_1794254676694.jpg';
import socEvalImg from './assets/images/soc_evaluation_scoreboard_1794254677120.jpg';
import onnxEdgeImg from './assets/images/onnx_edge_deployment_1794254678406.jpg';

export default function App() {
  const [activePhase, setActivePhase] = useState<number>(0); // 0 = Intro tab
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Intro Visual
  const IntroImageVisual = () => (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-center">
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Masterclass Overview: End-to-End AI Engineering Pipeline</div>
      <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        <img
          src={introOverviewImg}
          alt="NIDS Mini: AI Network Shield Project Overview"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        <strong>Your Goal:</strong> Build a 3.18M parameter neural network from scratch in PyTorch to protect networks against hackers in real time.
      </p>
    </div>
  );

  // Phase Image Visual Components
  const Phase1ImageVisual = () => (
    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Phase 1 Data Explorer: Good vs Bad Data</span>
        <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">CIC-IDS2017 Dataset</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bad Data Card */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <span>❌ Real-Life Raw Data (Messy & Broken)</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-rose-900/40 font-mono text-[11px] text-rose-200 overflow-x-auto space-y-1">
            <div>FlowDuration: NaN | FwdPkts: -999 | FlowBytes: Inf</div>
            <div>SrcIP: 192.168.1.5 | DstIP: ??? | Label: ???</div>
            <div className="text-rose-400">⚠️ Corrupted packet header, missing values, crash risk!</div>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            <strong>In Real Life:</strong> Network logs have missing values, corrupted bytes, and crashes. Data scientists spend 80% of their time fixing this manually!
          </p>
        </div>

        {/* Good Data Card */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <span>✅ Our Project Data (Clean & Ready)</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-emerald-900/40 font-mono text-[11px] text-emerald-200 overflow-x-auto space-y-1">
            <div>FlowDuration: 0.42 | FwdPkts: 12.0 | FlowBytes: 0.18</div>
            <div>SrcIP_Scaled: 0.05 | DstIP_Scaled: -0.12 | Label: 1 (DoS)</div>
            <div className="text-emerald-400">✨ 78 normalized numerical features, 0 nulls, ready for AI!</div>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            <strong>For This Project:</strong> We pre-cleaned the CIC-IDS2017 dataset into parquet tables so you can start learning AI immediately without debugging.
          </p>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        <img
          src={dataCleaningImg}
          alt="Phase 1: Data Cleaning Pipeline"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed text-center">
        <strong>How we got the data:</strong> Collected from the CIC-IDS2017 cyber testbed simulating real-world hacker attacks (DDoS, Port Scans) against corporate networks.
      </p>
    </div>
  );

  const Phase2ImageVisual = () => (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-center">
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Phase 2 Visual: ResFlowNet 3.18M Parameters & Skip Connections</div>
      <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        <img
          src={neuralArchImg}
          alt="Phase 2: ResFlowNet Architecture"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        <strong>What this shows:</strong> 78 input features mapping to 256 dimensions and 6 residual blocks featuring the skip connection shortcut <code className="text-cyan-300">x + F(x)</code>.
      </p>
    </div>
  );

  const Phase3ImageVisual = () => (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-center">
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Phase 3 Visual: Focal Loss Training & Loss Convergence Curve</div>
      <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        <img
          src={trainingLossImg}
          alt="Phase 3: Training Loss Graph"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        <strong>What this shows:</strong> Training error dropping from 1.84 down to 0.038 across epochs using AdamW and Focal Loss <code className="text-cyan-300">FL(p_t) = -α(1-p_t)^γ log(p_t)</code>.
      </p>
    </div>
  );

  const Phase4ImageVisual = () => (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-center">
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Phase 4 Visual: SOC Evaluation Report & 15 Attack Classes</div>
      <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        <img
          src={socEvalImg}
          alt="Phase 4: SOC Evaluation Report"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        <strong>What this shows:</strong> Security Operations Center evaluation scoreboard verifying 98.40% overall accuracy and 94.12% Macro F1-Score.
      </p>
    </div>
  );

  const Phase5ImageVisual = () => (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-center">
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Phase 5 Visual: ONNX Edge Inference & Sub-Millisecond Prober</div>
      <div className="rounded-lg overflow-hidden border border-slate-800 shadow-lg">
        <img
          src={onnxEdgeImg}
          alt="Phase 5: ONNX Edge Inference"
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        <strong>What this shows:</strong> Packet flow scoring in 0.062 milliseconds with benign vs attack classification on firewall hardware.
      </p>
    </div>
  );

  const Phase6ExecutionVisual = () => (
    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-center">
      <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Live Execution Simulation: Seeing the AI Catch Hackers</div>
      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 font-mono text-xs text-emerald-200 text-left">
        <div className="text-slate-400">$ python predict_flow.py</div>
        <div className="text-white">AI Defense Prober Online and Listening!</div>
        <div className="text-cyan-300">Inspecting incoming network packet...</div>
        <div className="text-rose-400 font-bold">🚨 THREAT DETECTED: DoS Slowloris (Confidence: 98.5%)</div>
        <div className="text-emerald-300">Speed: 0.062 ms | Firewall Action: IP Blocked</div>
      </div>
      <p className="text-xs text-slate-400">This is what success looks like when you run your model locally in your terminal!</p>
    </div>
  );

  const phases = [
    {
      id: 0,
      title: 'Introduction: Welcome to NIDS Mini',
      subtitle: 'What you are building and what you will master',
      goal: 'Welcome to your AI engineering journey! In this masterclass, you will build a real-world artificial intelligence cybersecurity system from scratch.',
      description: 'NIDS Mini is an AI Network Intrusion Detector. It examines incoming internet traffic and instantly blocks cyber attacks like DDoS, Port Scans, and Brute Force attempts before they compromise corporate servers.',
      visualComponent: <IntroImageVisual />,
      glossary: [
        { term: 'Cybersecurity', simple: 'Protecting computers, networks, and programs from digital attacks by hackers.' },
        { term: 'Artificial Intelligence (AI)', simple: 'Teaching computers to spot complex patterns and make smart decisions like a human.' },
        { term: 'PyTorch', simple: 'The world-famous programming library used by engineers to build artificial brains.' }
      ],
      commands: [
        { cmd: 'git clone https://github.com/your-username/nids-mini.git', meaning: 'Downloads the starting skeleton files to your computer.' },
        { cmd: 'cd nids-mini', meaning: 'Moves your terminal inside your new project folder.' }
      ],
      codeFileName: 'OVERVIEW.md',
      codeChunks: [
        {
          title: 'What You Will Learn by the End of This Project',
          code: `# By completing NIDS Mini, you will master:
1. Data Engineering: Cleaning & Z-score scaling messy network CSVs.
2. Neural Architecture: Coding ResFlowNet with 3.18M parameters & skip connections in PyTorch.
3. Model Training: Implementing custom training loops, AdamW, and Focal Loss.
4. Security Metrics: Evaluating Precision, Recall, and Macro F1-Score like a SOC analyst.
5. Edge Deployment: Serializing to ONNX for 0.06ms lightning-fast real-time inference.`,
          plain: 'A complete end-to-end journey from raw data all the way to a production-ready security defense tool.'
        }
      ]
    },
    {
      id: 1,
      title: 'Phase 1: Data Explorer (Good vs Bad Data)',
      subtitle: 'What real-life messy data looks like vs clean project data',
      goal: 'Network traffic data in the real world is messy and broken. In this tab, we explore what bad data looks like, what good data looks like, how we collected it from enterprise testbeds, and how real-life data engineers manually clean it.',
      description: 'In real life, raw network packet logs contain missing values (NaN), infinite durations, and corrupted bytes that crash AI models. Data scientists spend days writing custom Python scripts to clean this manually. For this learning project, we provide a pre-cleaned parquet dataset so you can start learning AI immediately!',
      visualComponent: <Phase1ImageVisual />,
      glossary: [
        { term: 'Tensor', simple: 'Just a fancy math word for a grid or list of numbers that computers and AI models use to think.' },
        { term: 'Scaler', simple: 'A tool that shrinks or stretches numbers so they all fit on the same fair size scale (like converting inches and miles all into centimeters).' },
        { term: 'Parquet', simple: 'A super-fast, compressed file format that stores spreadsheets neatly on your hard drive.' }
      ],
      commands: [
        { cmd: 'python -m venv venv', meaning: 'Creates a private, isolated folder on your computer just for this project so your software packages do not mix with other things.' },
        { cmd: 'source venv/bin/activate  # (or venv\\Scripts\\activate on Windows)', meaning: 'Turns on your private environment so your computer knows to use our project settings.' },
        { cmd: 'pip install pandas pyarrow datasets scikit-learn torch', meaning: 'Downloads the toolkit libraries (like PyTorch for AI and Pandas for data tables).' }
      ],
      codeFileName: 'dataset_pipeline.py',
      codeChunks: [
        {
          title: 'Chunk 1: Loading Data Table',
          code: `# Chunk 1: Load clean parquet file into Pandas
import pandas as pd
df = pd.read_parquet("clean_nids_sample.parquet")
print(f"Loaded {len(df):,} network flow records!")`,
          plain: 'Loads our saved clean table of network traffic stats into Python memory.'
        },
        {
          title: 'Chunk 2: Splitting Train vs Test',
          code: `# Chunk 2: Separate features and split dataset
X = df.drop(columns=['Label']).values
y = df['Label'].values`,
          plain: 'Separates the 78 input network features (X) from the attack answer labels (y).'
        },
        {
          title: 'Chunk 3: Z-Score Normalization Scaler',
          code: `# Chunk 3: Standardize numbers
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)`,
          plain: 'Applies our apple-to-elephant math formula so every feature has a mean of 0 and spread of 1.'
        }
      ]
    },
    {
      id: 2,
      title: 'Phase 2: Building the AI Brain (ResFlowNet)',
      subtitle: 'Designing a 3.5M Parameter Neural Network',
      goal: 'We build our AI model from scratch using PyTorch. It features 6 stacked "residual blocks" that let information flow freely without getting stuck or vanishing.',
      description: 'We build our neural network using PyTorch object-oriented modules. Stacking 6 residual blocks gives the model 3.18 million parameters, which is the perfect sweet spot for learning cyber attack patterns without slowing down.',
      visualComponent: <Phase2ImageVisual />,
      glossary: [
        { term: 'Neural Network', simple: 'A computer system inspired by the human brain that learns to spot patterns by practicing over and over.' },
        { term: 'Weights', simple: 'Adjustable knobs inside the AI brain that get turned up or down when learning what is safe versus what is a hacker.' },
        { term: 'Skip Connections', simple: 'Shortcuts that let information jump forward over layers so the AI never forgets what it learned.' }
      ],
      commands: [
        { cmd: 'python model.py', meaning: 'Runs our PyTorch script to build the neural network and count its internal connection weights.' }
      ],
      codeFileName: 'model.py',
      codeChunks: [
        {
          title: 'Chunk 1: Blueprint Class Setup',
          code: `# Chunk 1: Define ResFlowNet class blueprint
import torch
import torch.nn as nn

class ResFlowNet(nn.Module):
    def __init__(self, d_in=78, d_model=256, num_classes=15):
        super().__init__()
        self.input_layer = nn.Linear(d_in, d_model)`,
          plain: 'Sets up the PyTorch neural network class and creates the first layer to receive 78 network features.'
        },
        {
          title: 'Chunk 2: Residual Block & Skip Connection',
          code: `# Chunk 2: Add skip connection shortcut
    def forward(self, x):
        out = torch.relu(self.input_layer(x))
        return out + x  # Skip connection shortcut!`,
          plain: 'Passes data through the layer and adds the original input back (`+ x`) so signals never fade.'
        },
        {
          title: 'Chunk 3: Final Classifier Head',
          code: `# Chunk 3: Output logits for 15 classes
        self.output_layer = nn.Linear(d_model, num_classes)
    def classify(self, out):
        return self.output_layer(out)`,
          plain: 'Maps the internal brain signals into 15 possible traffic scores (Normal vs 14 attacks).'
        }
      ]
    },
    {
      id: 3,
      title: 'Phase 3: Teaching & Training the AI',
      subtitle: 'Running the Training Loop and Focal Loss',
      goal: 'We feed our network batches of network traffic over and over. When it makes a mistake, our optimizer adjusts its 3.18M internal weights so it gets smarter every time.',
      description: 'Training is an iterative loop where the AI makes a prediction, calculates how wrong it was using Focal Loss, and uses the AdamW optimizer to tweak its 3.18 million weights so it performs better on the next batch.',
      visualComponent: <Phase3ImageVisual />,
      glossary: [
        { term: 'Optimizer', simple: 'The coach of the AI that looks at mistakes and tweaks all 3.18 million knobs to make the AI smarter.' },
        { term: 'Focal Loss', simple: 'A special scoring rule that forces the AI to pay extra attention to rare, sneaky hacker attacks instead of ignoring them.' },
        { term: 'Epoch', simple: 'One complete practice round of showing the AI every single training packet in our dataset.' }
      ],
      commands: [
        { cmd: 'python train_full.py', meaning: 'Starts the training session where the AI learns from the data over multiple epochs.' }
      ],
      codeFileName: 'train_full.py',
      codeChunks: [
        {
          title: 'Chunk 1: Resetting Gradients',
          code: `# Chunk 1: Clear old memory adjustments
optimizer.zero_grad()`,
          plain: 'Wipes the slate clean so old calculation errors do not mess up the new batch.'
        },
        {
          title: 'Chunk 2: Forward Pass & Loss Calculation',
          code: `# Chunk 2: Predict and measure mistake
logits = model(features)
loss = criterion(logits, targets)`,
          plain: 'The AI makes its best guess, and Focal Loss grades how wrong the guess was.'
        },
        {
          title: 'Chunk 3: Backpropagation & Weight Update',
          code: `# Chunk 3: Backward pass and optimizer step
loss.backward()
optimizer.step()`,
          plain: 'Calculates blame for all 3.18M weights and takes a tiny step to improve accuracy.'
        }
      ]
    },
    {
      id: 4,
      title: 'Phase 4: Testing & SOC Evaluation',
      subtitle: 'Checking How Well Our AI Catches Hackers',
      goal: 'We test our trained AI against 5,000 completely new network flows it has never seen before to measure its false alarm rate and attack detection accuracy.',
      description: 'We evaluate our trained model against an unseen test dataset. By measuring Macro F1-Score and Benign Precision, we ensure our security system has a low false alarm rate and catches stealthy attacks reliably.',
      visualComponent: <Phase4ImageVisual />,
      glossary: [
        { term: 'Precision', simple: 'How trustworthy the AI is when it yells "Hacker!" (making sure it is not crying wolf).' },
        { term: 'Recall', simple: 'How good the AI is at catching actual hackers without letting any slip by.' },
        { term: 'Macro F1-Score', simple: 'A fair overall report card grade that combines precision and recall across all attack types.' }
      ],
      commands: [
        { cmd: 'python eval.py', meaning: 'Runs our testing script to generate a security report card for our AI.' }
      ],
      codeFileName: 'eval.py',
      codeChunks: [
        {
          title: 'Chunk 1: Loading Saved Model Weights',
          code: `# Chunk 1: Load best saved checkpoint
model.load_state_dict(torch.load("checkpoints/best_nids_model.pth"))
model.eval()`,
          plain: 'Loads our best trained AI brain into computer memory for testing.'
        },
        {
          title: 'Chunk 2: Scoring Unseen Test Flows',
          code: `# Chunk 2: Run inference on test set
preds = model(test_features).argmax(dim=-1)`,
          plain: 'Passes 5,000 brand new test packets through our AI to collect its verdicts.'
        },
        {
          title: 'Chunk 3: Generating F1 Report Card',
          code: `# Chunk 3: Calculate Macro F1 and precision
from sklearn.metrics import classification_report
print(classification_report(true_labels, preds))`,
          plain: 'Calculates the final security report card showing precision, recall, and Macro F1.'
        }
      ]
    },
    {
      id: 5,
      title: 'Phase 5: Deploying for Real-Time Defense',
      subtitle: 'Exporting to ONNX for Sub-Millisecond Speed',
      goal: 'We package our trained AI into a universal file format (ONNX) so it can inspect thousands of network packets per second on any computer or firewall in under 0.06 milliseconds.',
      description: 'We serialize our trained PyTorch weights into open ONNX format. This allows our intrusion detector to run on any CPU or edge firewall at lightning speed without requiring the heavy PyTorch library.',
      visualComponent: <Phase5ImageVisual />,
      glossary: [
        { term: 'ONNX', simple: 'A universal file format that lets AI models run on any device or software smoothly.' },
        { term: 'Inference', simple: 'When the trained AI is put to work in real life, making split-second decisions on new incoming traffic.' },
        { term: 'Quantization', simple: 'Shrinking the file size of the AI brain so it runs even faster on smaller computers.' }
      ],
      commands: [
        { cmd: 'python export_onnx.py', meaning: 'Packages our PyTorch brain into a lightweight deployment file.' },
        { cmd: 'python predict_flow.py', meaning: 'Runs a live test inspecting a network packet flow instantly.' }
      ],
      codeFileName: 'predict_flow.py',
      codeChunks: [
        {
          title: 'Chunk 1: Loading ONNX Runtime Session',
          code: `# Chunk 1: Open lightweight ONNX engine
import onnxruntime as ort
session = ort.InferenceSession("nids_mini.onnx")`,
          plain: 'Opens our lightning-fast ONNX file for instant packet inspection.'
        },
        {
          title: 'Chunk 2: Scaling Live Packet Features',
          code: `# Chunk 2: Scale incoming live packet
scaled_packet = scaler.transform(raw_packet)`,
          plain: 'Normalizes the live packet using our saved Z-score scaler.'
        },
        {
          title: 'Chunk 3: Sub-Millisecond Verdict',
          code: `# Chunk 3: Run instant inference
verdict = session.run(None, {'flow_features': scaled_packet})`,
          plain: 'Produces the final security verdict in under 0.06 milliseconds!'
        }
      ]
    },
    {
      id: 6,
      title: 'Phase 6: Final Execution & Live Demo',
      subtitle: 'Step-by-Step Guide to Running Your AI Model Locally',
      goal: 'Now that you have built all parts of the project, here is the exact master checklist to run your AI model in your local terminal and watch it catch hackers live!',
      description: 'Follow these 4 simple steps in your local terminal to execute data loading, training, evaluation, and real-time defense probing.',
      visualComponent: <Phase6ExecutionVisual />,
      glossary: [
        { term: 'Execution', simple: 'Actually telling your computer to run the Python scripts you wrote.' },
        { term: 'Terminal Window', simple: 'The command line box where your Python script runs and prints out live security alerts.' }
      ],
      commands: [
        { cmd: 'python load_clean_data.py', meaning: 'Step 1: Downloads and verifies the clean dataset.' },
        { cmd: 'python train_full.py', meaning: 'Step 2: Trains the AI model over multiple epochs and saves the best weights.' },
        { cmd: 'python predict_flow.py', meaning: 'Step 3: Runs live real-time packet inspection in under 0.06ms!' }
      ],
      codeFileName: 'MASTER_CHECKLIST.sh',
      codeChunks: [
        {
          title: 'Step 1: Prepare Data',
          code: `python load_clean_data.py`,
          plain: 'Run this first to make sure your clean dataset cache is ready.'
        },
        {
          title: 'Step 2: Train AI Model',
          code: `python train_full.py`,
          plain: 'Run this second to train the 3.18M parameters and save checkpoints/best_nids_model.pth.'
        },
        {
          title: 'Step 3: Run Live Defense Prober',
          code: `python export_onnx.py && python predict_flow.py`,
          plain: 'Run this last to export to ONNX and test lightning-fast real-time hack detection!'
        }
      ]
    }
  ];

  const currentPhase = phases.find((p) => p.id === activePhase) || phases[0];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#070A0F]/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">NIDS Mini: Learn to build an AI</h1>
            <p className="text-xs text-slate-400 font-mono">Step-by-Step AI Engineering</p>
          </div>
        </div>
      </header>

      {/* Main Layout with Left Sidebar */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full lg:w-72 shrink-0 space-y-2 lg:sticky lg:top-24">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-2 mb-2">Masterclass Modules</div>
          <div className="space-y-1.5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
            {phases.map((p) => {
              const isActive = p.id === activePhase;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePhase(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 shrink-0 lg:shrink w-60 lg:w-full ${
                    isActive
                      ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {p.id === 0 ? 'INTRO' : `PHASE ${p.id}`}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold leading-snug line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {p.id === 0 ? 'Introduction & Overview' : p.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Active Phase Detailed Guide Card with Embedded Image Visuals, Glossary, Chunked Code & Execution Guide */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Column of Content: Plain English Explanation, Glossary Card & Generated Image Visual (6 Cols) */}
            <div className="xl:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                    {activePhase === 0 ? 'Masterclass Overview' : `Phase ${activePhase} of ${phases.length - 1} Breakdown`}
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-2">{currentPhase.title}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{currentPhase.goal}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <h3 className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{activePhase === 0 ? 'What you will master:' : 'Why we do this in plain English:'}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentPhase.description}
                  </p>
                </div>
              </div>

              {/* Generated Professional Image Visual Component */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Professional Diagram & Illustration</span>
                </h3>
                {currentPhase.visualComponent}
              </div>

              {/* Beginner-Friendly Glossary Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Beginner-Friendly Glossary (Hard Words Explained)</span>
                </h3>
                <div className="space-y-3">
                  {currentPhase.glossary.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                      <span className="font-mono font-bold text-cyan-300 block">📚 {item.term}</span>
                      <p className="text-slate-300 leading-snug">{item.simple}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Command Prompts for this Phase */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>{activePhase === 0 ? 'Getting Started Commands' : 'Commands to Run in Your Terminal'}</span>
                </h3>

                <div className="space-y-3">
                  {currentPhase.commands.map((comm, idx) => {
                    const cmdKey = `cmd-${activePhase}-${idx}`;
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 overflow-x-auto block">
                            {comm.cmd}
                          </code>
                          <button
                            onClick={() => handleCopy(comm.cmd, cmdKey)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {copiedKey === cmdKey ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">
                          <strong className="text-white">What this means:</strong> {comm.meaning}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column of Content: Chunk-by-Chunk Code Breakdown (6 Cols) */}
            <div className="xl:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">{currentPhase.codeFileName} (Divided into Chunks)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentPhase.codeChunks.map((chunk, idx) => {
                    const chunkKey = `chunk-${activePhase}-${idx}`;
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-cyan-300">{chunk.title}</span>
                          <button
                            onClick={() => handleCopy(chunk.code, chunkKey)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === chunkKey ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Chunk</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-3 rounded-lg bg-[#05070B] border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                          <code>{chunk.code}</code>
                        </pre>

                        <p className="text-xs text-slate-300 leading-snug">
                          <strong className="text-white">What this chunk does:</strong> {chunk.plain}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 px-6 text-xs text-slate-400">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          <span>NIDS Mini Visual AI Masterclass · Designed for Beginners</span>
          <span><strong>Created by Sajid Hossain (<a href="https://sazid63.netlify.app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://sazid63.netlify.app</a>)</strong></span>
        </div>
      </footer>
    </div>
  );
}
