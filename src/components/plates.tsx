import type { ReactNode } from 'react';
import { RESULTS } from '../data/results';

// Hand-built illustrations, one per room ("plates"). Flat colour, big labels, plain words.
const INK = 'var(--ink)';
const LINE = 'var(--line)';
const AMBER = 'var(--amber)';
const VIOLET = 'var(--violet)';
const CORAL = 'var(--coral)';
const TEAL = 'var(--teal)';
const BLUE = 'var(--blue)';
const NAVY = 'var(--navy)';
const WHITE = '#ffffff';

const sans = { fontFamily: "var(--font-sans)" } as const;
const display = { fontFamily: "var(--font-display)" } as const;

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 720 440" role="img" aria-label={label} className="block h-auto w-full">
      <rect x="1" y="1" width="718" height="438" rx="10" fill={WHITE} stroke={LINE} strokeWidth="2" />
      {children}
    </svg>
  );
}

function Txt(p: { x: number; y: number; size?: number; weight?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; children: ReactNode; font?: 'sans' | 'display' | 'mono'; rotate?: number }) {
  const { x, y, size: baseSize = 24, weight = 600, fill = INK, anchor = 'middle', children, font = 'sans', rotate } = p;
  const size = Math.round(baseSize * 1.16);
  const style = font === 'display' ? display : font === 'mono' ? { fontFamily: 'var(--font-mono)' } : sans;
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} style={style} transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}>
      {children}
    </text>
  );
}

function Arrow({ x1, y1, x2, y2, color = INK }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 10;
  const p1 = [x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)];
  const p2 = [x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)];
  return (
    <g stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polyline points={`${p1[0]},${p1[1]} ${x2},${y2} ${p2[0]},${p2[1]}`} />
    </g>
  );
}

function Packet({ x, y, color, rotate = 0 }: { x: number; y: number; color: string; rotate?: number }) {
  return (
    <g transform={`rotate(${rotate} ${x + 22} ${y + 17})`} stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
      <rect x={x} y={y} width="44" height="34" rx="4" fill={color} />
      <polyline points={`${x},${y} ${x + 22},${y + 17} ${x + 44},${y}`} fill="none" />
    </g>
  );
}

/* ---------- Welcome: traffic goes through a guard ---------- */
export function WelcomePlate() {
  return (
    <Frame label="Internet traffic arrives. An AI guard lets safe traffic reach the server and stops attacks.">
      <Txt x={24} y={96} anchor="start" size={26} weight={700}>Traffic comes in</Txt>
      <line x1="24" y1="230" x2="262" y2="230" stroke={LINE} strokeWidth="6" strokeLinecap="round" />
      <Packet x={34} y={196} color={TEAL} />
      <Packet x={92} y={196} color={CORAL} />
      <Packet x={150} y={196} color={TEAL} />
      <Packet x={208} y={196} color={CORAL} />
      <Arrow x1={268} y1={230} x2={296} y2={230} />

      {/* the guard */}
      <path d="M380 108 L474 140 V232 C474 292 432 334 380 354 C328 334 286 292 286 232 V140 Z" fill={NAVY} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="380" cy="234" rx="38" ry="22" fill={WHITE} />
      <circle cx="380" cy="234" r="14" fill={AMBER} stroke={INK} strokeWidth="2.5" />
      <circle cx="380" cy="234" r="6" fill={INK} />
      <Txt x={380} y={398} size={30} weight={800} font="display">AI guard</Txt>

      {/* safe lane */}
      <line x1="478" y1="196" x2="590" y2="196" stroke={TEAL} strokeWidth="6" strokeLinecap="round" />
      <Packet x={498} y={179} color={TEAL} />
      <Arrow x1={560} y1={196} x2={592} y2={196} color={TEAL} />
      <rect x="598" y="150" width="96" height="30" rx="6" fill={INK} />
      <rect x="598" y="186" width="96" height="30" rx="6" fill={INK} />
      <rect x="598" y="222" width="96" height="30" rx="6" fill={INK} />
      <circle cx="614" cy="165" r="5" fill={TEAL} />
      <circle cx="614" cy="201" r="5" fill={TEAL} />
      <circle cx="614" cy="237" r="5" fill={TEAL} />
      <Txt x={646} y={124} size={26} weight={700}>Server</Txt>

      {/* blocked lane */}
      <Packet x={492} y={290} color={CORAL} rotate={14} />
      <circle cx="580" cy="318" r="26" fill={CORAL} stroke={INK} strokeWidth="3" />
      <path d="M568 306 L592 330 M592 306 L568 330" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <Txt x={598} y={382} size={26} weight={700}>Attack stopped</Txt>
    </Frame>
  );
}

/* ---------- Room 1: messy table -> clean -> three piles ---------- */
export function DataPlate() {
  const broken = new Map<string, string>([['1,2', '?'], ['2,0', '∞'], ['3,3', '−1'], ['4,1', '?']]);
  const cells: ReactNode[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 4; c++) {
      const key = `${r},${c}`;
      const x = 36 + c * 42;
      const y = 96 + r * 38;
      const bad = broken.get(key);
      cells.push(
        <g key={key}>
          <rect x={x} y={y} width="40" height="36" fill={bad ? CORAL : WHITE} stroke={INK} strokeWidth="2" />
          {bad ? <Txt x={x + 20} y={y + 26} size={22} weight={800}>{bad}</Txt> : <rect x={x + 8} y={y + 14} width={12 + ((r * 7 + c * 11) % 5) * 4} height="8" rx="2" fill={LINE} />}
        </g>,
      );
    }
  }
  const pile = (x: number, n: number, color: string, label: string, pct: string) => (
    <g key={label}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={x} y={300 - i * 17} width="50" height="22" rx="4" fill={color} stroke={INK} strokeWidth="2.5" />
      ))}
      <Txt x={x + 25} y={300 - n * 17 - 8} size={19} weight={800}>{pct}</Txt>
      <Txt x={x + 25} y={338} size={19} weight={700}>{label}</Txt>
    </g>
  );
  return (
    <Frame label="Raw data has broken cells. It gets cleaned, put on one ruler, and split into a learning pile, a quiz pile and an exam pile.">
      <Txt x={120} y={56} size={26} weight={700}>Raw table</Txt>
      {cells}
      <Txt x={120} y={386} size={26} weight={700}>1. Messy</Txt>

      <Arrow x1={212} y1={200} x2={252} y2={200} />

      <Txt x={360} y={56} size={26} weight={700}>Tidy up</Txt>
      <path d="M272 90 H448 L384 188 V240 H336 V188 Z" fill={AMBER} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="312" cy="68" r="7" fill={CORAL} stroke={INK} strokeWidth="2" />
      <circle cx="360" cy="76" r="7" fill={CORAL} stroke={INK} strokeWidth="2" />
      <circle cx="408" cy="68" r="7" fill={CORAL} stroke={INK} strokeWidth="2" />
      <rect x="300" y="262" width="120" height="14" rx="3" fill={WHITE} stroke={INK} strokeWidth="2.5" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={312 + i * 12} y1="262" x2={312 + i * 12} y2={i % 2 ? 270 : 276} stroke={INK} strokeWidth="2" />
      ))}
      <Txt x={360} y={310} size={22} weight={600}>one ruler for all</Txt>
      <Txt x={360} y={386} size={26} weight={700}>2. Cleaned</Txt>

      <Arrow x1={456} y1={200} x2={486} y2={200} />

      {pile(504, 5, TEAL, 'Learn', '70%')}
      {pile(580, 2, AMBER, 'Quiz', '15%')}
      {pile(652, 2, CORAL, 'Exam', '15%')}
      <Txt x={600} y={386} size={24} weight={700}>3. Three piles</Txt>
    </Frame>
  );
}

/* ---------- Room 2: clues -> start -> six shortcut blocks -> 15 scores ---------- */
export function BrainPlate() {
  const dots: ReactNode[] = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 13; c++) dots.push(<circle key={`${r}-${c}`} cx={26 + c * 11} cy={52 + r * 13} r="3.6" fill={AMBER} />);
  const barLens = [64, 8, 6, 10, 7, 6, 5, 9, 6, 5, 7, 6, 8, 5, 6];
  return (
    <Frame label="78 clues go in, pass through a start layer and six blocks that each have a shortcut, and come out as 15 scores.">
      {/* top row */}
      {dots}
      <Txt x={96} y={176} size={22} weight={700}>78 clues</Txt>
      <Arrow x1={176} y1={80} x2={206} y2={80} />
      <rect x="214" y="30" width="54" height="104" rx="10" fill={VIOLET} stroke={INK} strokeWidth="3" />
      <Txt x={241} y={176} size={22} weight={700}>Start</Txt>
      <Arrow x1={282} y1={80} x2={312} y2={80} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x="322" y={26 + i * 18} width="100" height="14" rx="4" fill={VIOLET} stroke={INK} strokeWidth="2.5" />
      ))}
      <path d="M430 33 C452 33 452 125 430 125" fill="none" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" />
      <Txt x={372} y={176} size={22} weight={700}>6 blocks</Txt>
      <Arrow x1={470} y1={80} x2={500} y2={80} />
      {barLens.map((len, i) => (
        <rect key={i} x="510" y={24 + i * 7.6} width={len * 2.4} height="5.4" rx="2" fill={i === 0 ? TEAL : '#b9bed6'} stroke={INK} strokeWidth="1.5" />
      ))}
      <Txt x={585} y={176} size={22} weight={700}>15 scores</Txt>
      <Txt x={618} y={86} size={19} weight={600} anchor="start">highest</Txt>
      <Txt x={618} y={110} size={19} weight={600} anchor="start">wins</Txt>

      <line x1="24" y1="206" x2="696" y2="206" stroke={LINE} strokeWidth="2" strokeDasharray="6 8" />

      {/* bottom row: inside one block */}
      <Txt x={24} y={236} anchor="start" size={26} weight={800} font="display">Inside one block</Txt>
      <circle cx="40" cy="330" r="12" fill={AMBER} stroke={INK} strokeWidth="2.5" />
      <Arrow x1={56} y1={330} x2={74} y2={330} />
      {[
        ['Mix', 80, VIOLET],
        ['Tidy', 168, TEAL],
        ['Gate', 256, AMBER],
        ['Mix', 344, VIOLET],
        ['Tidy', 432, TEAL],
      ].map(([label, x, color], i) => (
        <g key={i}>
          <rect x={x as number} y="304" width="76" height="52" rx="8" fill={color as string} stroke={INK} strokeWidth="3" />
          <Txt x={(x as number) + 38} y={338} size={21} weight={800} fill={color === VIOLET ? WHITE : INK}>{label as string}</Txt>
          {i < 4 && <Arrow x1={(x as number) + 80} y1={330} x2={(x as number) + 94} y2={330} />}
        </g>
      ))}
      <Arrow x1={512} y1={330} x2={540} y2={330} />
      <circle cx="568" cy="330" r="26" fill={WHITE} stroke={INK} strokeWidth="3" />
      <Txt x={568} y={342} size={36} weight={800}>+</Txt>
      <Arrow x1={596} y1={330} x2={628} y2={330} />
      <circle cx="646" cy="330" r="14" fill={AMBER} stroke={INK} strokeWidth="2.5" />
      <path d="M40 316 C40 262 568 262 568 300" fill="none" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 0" />
      <polyline points="560,290 568,302 576,290" fill="none" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <Txt x={462} y={258} size={21} weight={800} fill="#b4301f">shortcut: the clues skip ahead</Txt>
      <Txt x={360} y={412} size={19} weight={600}>Mix, tidy, gate, mix, tidy, then add the shortcut back.</Txt>
    </Frame>
  );
}

/* ---------- Room 3: the practice loop and the real loss curve ---------- */
export function TrainPlate() {
  const data = RESULTS.epochs;
  const max = Math.max(...data.map((d) => d.loss)) * 1.08;
  const x0 = 96;
  const x1 = 690;
  const yTop = 238;
  const yBot = 394;
  const pts = data.map((d, i) => [x0 + (i / (data.length - 1)) * (x1 - x0), yBot - (d.loss / max) * (yBot - yTop)] as const);
  const steps = [
    ['Guess', 90],
    ['Measure', 270],
    ['Blame', 450],
    ['Nudge', 630],
  ] as const;
  return (
    <Frame label="Training repeats four steps: guess, measure the mistake, find what to blame, nudge the knobs. The mistake score falls from 0.026 to 0.0025 over 15 rounds.">
      {steps.map(([label, x], i) => (
        <g key={label}>
          <circle cx={x} cy="108" r="34" fill={[AMBER, CORAL, VIOLET, TEAL][i]} stroke={INK} strokeWidth="3" />
          <Txt x={x} y={120} size={32} weight={800} font="display" fill={i === 2 ? WHITE : INK}>{i + 1}</Txt>
          <Txt x={x} y={170} size={24} weight={700}>{label}</Txt>
          {i < 3 && <Arrow x1={x + 42} y1={108} x2={steps[i + 1][1] - 42} y2={108} />}
        </g>
      ))}
      <path d="M630 70 C630 16 90 16 90 66" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <polyline points="82,56 90,68 98,56" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <Txt x={360} y={60} size={22} weight={700}>repeat, thousands of times</Txt>

      {/* chart */}
      <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke={INK} strokeWidth="3" />
      <line x1={x0} y1={yTop - 8} x2={x0} y2={yBot} stroke={INK} strokeWidth="3" />
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={CORAL} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="5" fill={WHITE} stroke={INK} strokeWidth="2.5" />
      ))}
      <Txt x={pts[0][0] + 14} y={pts[0][1] + 6} anchor="start" size={22} weight={700}>{data[0].loss.toFixed(3)}</Txt>
      <Txt x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1] - 16} anchor="end" size={22} weight={700}>{data[data.length - 1].loss.toFixed(4)}</Txt>
      <Txt x={36} y={316} size={22} weight={700} rotate={-90}>Mistake score</Txt>
      <Txt x={x0} y={426} size={22} weight={600} anchor="start">Round 1</Txt>
      <Txt x={x1} y={426} size={22} weight={600} anchor="end">Round 15</Txt>
    </Frame>
  );
}

/* ---------- Room 5: packed file -> web address -> verdict ---------- */
export function DeployPlate() {
  return (
    <Frame label="The packed AI file sits behind a web address. Any program can send 78 numbers and gets back allow or block.">
      {/* file */}
      <path d="M52 44 H112 L142 74 V156 H52 Z" fill={AMBER} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <polyline points="112,44 112,74 142,74" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Txt x={97} y={124} size={24} weight={800}>.onnx</Txt>
      <Txt x={97} y={192} size={22} weight={700}>Packed AI</Txt>
      <Txt x={97} y={218} size={22} weight={600}>{RESULTS.onnxMB} MB</Txt>

      <Arrow x1={170} y1={104} x2={238} y2={104} />

      {/* cloud / web address */}
      <path d="M290 150 C262 150 252 112 280 104 C280 70 330 62 346 88 C368 58 420 70 418 106 C448 108 452 150 420 150 Z" fill={BLUE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Txt x={350} y={130} size={24} weight={700} fill={WHITE} font="mono">/predict</Txt>
      <Txt x={350} y={192} size={22} weight={700}>Web address</Txt>
      <Txt x={350} y={218} size={22} weight={600}>on free hosting</Txt>

      {/* any program */}
      <rect x="560" y="44" width="110" height="112" rx="12" fill={WHITE} stroke={INK} strokeWidth="3" />
      <rect x="574" y="58" width="82" height="62" rx="4" fill={TEAL} stroke={INK} strokeWidth="2.5" />
      <rect x="588" y="134" width="54" height="8" rx="4" fill={INK} />
      <Txt x={615} y={192} size={22} weight={700}>Any program</Txt>
      <Txt x={615} y={218} size={22} weight={600}>or website</Txt>

      <Arrow x1={540} y1={84} x2={456} y2={84} color={VIOLET} />
      <Arrow x1={456} y1={122} x2={540} y2={122} color={TEAL} />

      {/* the conversation */}
      <path d="M40 254 H340 Q350 254 350 264 V382 Q350 392 340 392 H62 L40 416 L46 392 H40 Q30 392 30 382 V264 Q30 254 40 254 Z" fill="#efeaff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Txt x={46} y={290} anchor="start" size={22} weight={800} fill={VIOLET}>ASK</Txt>
      <Txt x={46} y={328} anchor="start" size={24} weight={600}>Here are 78 numbers</Txt>
      <Txt x={46} y={358} anchor="start" size={24} weight={600}>about one flow.</Txt>

      <path d="M390 254 H690 Q700 254 700 264 V382 Q700 392 690 392 H682 L690 416 L664 392 H390 Q380 392 380 382 V264 Q380 254 390 254 Z" fill="#dcf6f3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <Txt x={396} y={290} anchor="start" size={22} weight={800} fill="#0a6f65">ANSWER</Txt>
      <Txt x={396} y={328} anchor="start" size={24} weight={700} font="mono">block</Txt>
      <Txt x={396} y={358} anchor="start" size={24} weight={600}>DoS Hulk, 100% sure</Txt>
    </Frame>
  );
}
