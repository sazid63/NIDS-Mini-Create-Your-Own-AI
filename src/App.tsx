import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Menu, X } from 'lucide-react';
import { ROOMS } from './data/rooms';
import type { Room, Step } from './data/types';
import { CodeBreakdown, CommandCard, Screen } from './components/ui';

const STORE = 'nids-mini-done';

function readDone(): string[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function roomFromHash(): number {
  const m = window.location.hash.match(/^#\/(\d)$/);
  const n = m ? Number(m[1]) : 0;
  return n >= 0 && n < ROOMS.length ? n : 0;
}

function Logo({ className = '' }: { className?: string }) {
  // An "N" drawn as a small network (four linked dots) inside a shield.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--navy)" />
      <path d="M16 4.5 L25.5 8 V16 C25.5 21.5 21.5 25.3 16 27.5 C10.5 25.3 6.5 21.5 6.5 16 V8 Z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      <polyline points="11.5,20.5 11.5,11.5 20.5,20.5 20.5,11.5" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="#fff">
        <circle cx="11.5" cy="20.5" r="2" />
        <circle cx="11.5" cy="11.5" r="2" />
        <circle cx="20.5" cy="20.5" r="2" />
        <circle cx="20.5" cy="11.5" r="2" />
      </g>
    </svg>
  );
}

/* ---------- The visitor map: where you are, where you can go ---------- */
function Map({ current, done, go, onStep }: { current: number; done: string[]; go: (n: number) => void; onStep: (id: string) => void }) {
  return (
    <nav aria-label="Rooms">
      <ol className="m-0 list-none space-y-1.5 p-0">
        {ROOMS.map((r) => {
          const doneCount = r.steps.filter((s) => done.includes(s.id)).length;
          const all = doneCount === r.steps.length;
          const active = r.id === current;
          return (
            <li key={r.id} data-room={r.id}>
              <a
                href={`#/${r.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(r.id);
                }}
                aria-current={active ? 'page' : undefined}
                className={`grid grid-cols-[2.5rem_1fr] items-center gap-3 rounded-lg px-2.5 py-2 no-underline transition-colors ${
                  active ? 'bg-[color-mix(in_oklab,var(--wall)_22%,white)]' : 'hover:bg-gallery'
                }`}
              >
                <span
                  className={`grid size-10 place-items-center rounded-md font-display text-lg font-extrabold ${
                    active || all ? 'bg-[var(--wall)] text-[var(--on-wall)]' : 'bg-white text-ink ring-2 ring-inset ring-line'
                  }`}
                  aria-hidden
                >
                  {all ? <Check size={20} strokeWidth={3} /> : r.id === 0 ? 'Hi' : r.id}
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-display text-[1.02rem] font-bold text-ink">{r.name}</span>
                  <span className="block text-[0.85rem] text-ink-2">
                    {all ? 'All steps done' : `${doneCount} of ${r.steps.length} steps done`}
                  </span>
                </span>
              </a>
              {active && (
                <ul className="m-0 mb-1 ml-[1.35rem] mt-1 list-none space-y-0.5 border-l border-line p-0 pl-4">
                  {r.steps.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => onStep(s.id)}
                        className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded bg-transparent px-1.5 py-1 text-left text-[0.92rem] text-ink-2 hover:text-ink"
                      >
                        <span className={`grid size-4 shrink-0 place-items-center rounded-sm ${done.includes(s.id) ? 'bg-[var(--wall)] text-[var(--on-wall)]' : 'ring-1 ring-inset ring-[var(--quiet)]'}`} aria-hidden>
                          {done.includes(s.id) && <Check size={12} strokeWidth={3.5} />}
                        </span>
                        <span>{s.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- One step ---------- */
function StepView({ step, done, toggle }: { step: Step; done: boolean; toggle: () => void }) {
  return (
    <section id={step.id} aria-labelledby={`${step.id}-h`} className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--wall)] font-display text-lg font-extrabold text-[var(--on-wall)]" aria-hidden>
          {step.num}
        </span>
        <h3 id={`${step.id}-h`} className="m-0 min-w-0 flex-1 basis-60 pt-0.5 font-display text-[1.2rem] font-extrabold leading-tight">
          <span className="sr-only">Step {step.num}: </span>
          {step.title}
        </h3>
        <button
          type="button"
          aria-pressed={done}
          onClick={toggle}
          className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3.5 text-[0.95rem] font-bold transition-colors ${
            done ? 'bg-ink text-white' : 'bg-white text-ink ring-2 ring-inset ring-line hover:ring-ink'
          }`}
        >
          <span className={`grid size-5 place-items-center rounded-sm ${done ? 'bg-white text-ink' : 'ring-2 ring-inset ring-ink'}`} aria-hidden>
            {done && <Check size={14} strokeWidth={3.5} />}
          </span>
          {done ? 'Done' : 'Mark as done'}
        </button>
      </div>
      <div className="max-w-[68ch] text-[1.0625rem] leading-relaxed">{step.why}</div>
      {step.code && <CodeBreakdown spec={step.code} />}
      {step.commands && (
        <div className="space-y-3">
          <p className="m-0 font-display text-[1.1rem] font-bold">
            {step.commands.length > 1 ? 'Type these in your terminal, one at a time' : 'Type this in your terminal'}
          </p>
          {step.commands.map((c) => (
            <CommandCard key={c.cmd} c={c} />
          ))}
        </div>
      )}
      {step.see && <Screen label={step.see.label} out={step.see.out} />}
      {step.extra}
      {step.stuck && (
        <p className="m-0 max-w-[68ch] rounded-lg bg-[color-mix(in_oklab,var(--wall)_16%,white)] p-4 text-[1rem] leading-relaxed">
          <strong className="font-extrabold">Stuck? </strong>
          {step.stuck}
        </p>
      )}
    </section>
  );
}

function scrollToFirst(room: Room) {
  document.getElementById(room.steps[0].id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- One room ---------- */
function RoomView({ room, done, toggleStep, go }: { room: Room; done: string[]; toggleStep: (id: string) => void; go: (n: number) => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (first.current) {
      first.current = false;
    } else {
      heading.current?.focus({ preventScroll: true });
    }
  }, [room.id]);
  const prev = ROOMS[room.id - 1];
  const next = ROOMS[room.id + 1];
  return (
    <article data-room={room.id} className="room-enter">
      <header className="bg-[var(--wall)] text-[var(--on-wall)]">
        <div className="mx-auto grid max-w-[960px] items-center gap-x-5 gap-y-1 px-5 py-5 sm:grid-cols-[auto_1fr] sm:py-6">
          <span aria-hidden className="numeral font-display text-[clamp(2.25rem,5vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">
            {room.id === 0 ? 'Hi' : room.id}
          </span>
          <div>
            <h1 ref={heading} tabIndex={-1} className="m-0 font-display text-[clamp(1.5rem,3.2vw,2.1rem)] font-extrabold leading-tight tracking-[-0.02em] outline-offset-8">
              {room.id > 0 && <span className="sr-only">Room {room.id}: </span>}
              {room.title}
            </h1>
            <p className="m-0 mt-1.5 max-w-[60ch] text-[1.02rem] leading-snug">{room.promise}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[960px] space-y-8 px-5 py-6">
        <section aria-labelledby="outcomes-h" className="space-y-3">
          <h2 id="outcomes-h" className="m-0 font-display text-[1.1rem] font-bold leading-tight">By the end of this room you will have</h2>
          <ul className="m-0 list-none space-y-2 p-0">
            {room.outcomes.map((o) => (
              <li key={o} className="flex max-w-[68ch] items-start gap-3 text-[1.0625rem]">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--wall)] text-[var(--on-wall)]" aria-hidden>
                  <Check size={13} strokeWidth={3.5} />
                </span>
                {o}
              </li>
            ))}
          </ul>
        </section>

        <figure className="plate mx-0 mt-0 max-w-[720px]">
          {room.plate}
          <figcaption className="mt-3 max-w-[68ch] text-[1rem] leading-relaxed text-ink-2">{room.caption}</figcaption>
          <button type="button" onClick={() => scrollToFirst(room)} className="mt-4 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-lg bg-[var(--wall)] px-5 font-bold text-[var(--on-wall)] hover:brightness-95">
            Start step 1 <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </figure>

        <section aria-labelledby="words-h" className="space-y-4">
          <h2 id="words-h" className="m-0 font-display text-[1.3rem] font-extrabold">Words to know</h2>
          <dl className="m-0 grid gap-3 sm:grid-cols-2">
            {room.words.map((w) => (
              <div key={w.term} className="rounded-lg border border-line bg-white p-4">
                <dt className="m-0 mb-1 font-display text-[1.1rem] font-bold">
                  <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-[var(--wall)] align-baseline" aria-hidden />
                  {w.term}
                </dt>
                <dd className="m-0 text-[1rem] leading-relaxed">{w.says}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="space-y-10">
          <h2 className="m-0 font-display text-[1.3rem] font-extrabold">What to do</h2>
          {room.steps.map((s) => (
            <StepView key={s.id} step={s} done={done.includes(s.id)} toggle={() => toggleStep(s.id)} />
          ))}
        </div>

        <footer className="space-y-4 border-t border-line pt-8">
          <p className="m-0 font-display text-[1.4rem] font-bold">{room.done}</p>
          <div className="flex flex-wrap gap-3">
            {prev && (
              <button type="button" onClick={() => go(prev.id)} className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-lg bg-white px-5 font-bold ring-2 ring-inset ring-line hover:ring-ink">
                <ArrowLeft size={18} strokeWidth={2.5} /> {prev.name}
              </button>
            )}
            {next && (
              <button type="button" onClick={() => go(next.id)} data-room={next.id} className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-lg bg-[var(--wall)] px-5 font-bold text-[var(--on-wall)] hover:brightness-95">
                Next: {next.name} <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}

export default function App() {
  const [current, setCurrent] = useState<number>(roomFromHash);
  const [done, setDone] = useState<string[]>(readDone);
  const [menu, setMenu] = useState(false);

  const go = useCallback((n: number) => {
    window.history.pushState(null, '', `#/${n}`);
    setCurrent(n);
    setMenu(false);
  }, []);

  useEffect(() => {
    const onPop = () => setCurrent(roomFromHash());
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  const toggleStep = (id: string) => {
    setDone((d) => {
      const nextDone = d.includes(id) ? d.filter((x) => x !== id) : [...d, id];
      try {
        window.localStorage.setItem(STORE, JSON.stringify(nextDone));
      } catch {
        // Progress is a convenience; the guide works without saving it.
      }
      return nextDone;
    });
  };

  const scrollToStep = (id: string) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const room = ROOMS[current];

  useEffect(() => {
    document.title = current === 0 ? 'NIDS Mini: Build Your Own AI Guard' : `${ROOMS[current].name} | NIDS Mini`;
  }, [current]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);
  const totalSteps = ROOMS.reduce((n, r) => n + r.steps.length, 0);
  const doneTotal = done.filter((id) => ROOMS.some((r) => r.steps.some((s) => s.id === id))).length;

  const brand = (
    <a href="#/0" onClick={(e) => { e.preventDefault(); go(0); }} className="flex items-center gap-3 no-underline">
      <Logo className="size-9" />
      <span className="leading-tight">
        <span className="block font-display text-[1.25rem] font-extrabold text-ink">NIDS Mini</span>
        <span className="block text-[0.85rem] text-ink-2">Build your own AI guard</span>
      </span>
    </a>
  );

  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">Skip to the lesson</a>

      {/* Phone and tablet: top bar with the map folded away */}
      <div className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          {brand}
          <button
            type="button"
            aria-expanded={menu}
            aria-controls="mobile-map"
            onClick={() => setMenu((m) => !m)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-ink px-3.5 text-[0.95rem] font-bold text-white"
          >
            {menu ? <X size={18} /> : <Menu size={18} />}
            Map
          </button>
        </div>
        {menu && (
          <div id="mobile-map" className="max-h-[75vh] overflow-y-auto border-t border-line bg-white p-3">
            <Map current={current} done={done} go={go} onStep={scrollToStep} />
          </div>
        )}
      </div>

      {/* Desktop: the visitor map stays beside you */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[310px] flex-col overflow-y-auto border-r border-line bg-white p-5 lg:flex">
        {brand}
        <div className="mt-6 flex-1">
          <h2 className="sr-only">Visitor map</h2>
          <Map current={current} done={done} go={go} onStep={scrollToStep} />
        </div>
        <p className="m-0 mt-5 rounded-lg bg-gallery p-3 text-[0.9rem] text-ink-2">
          <strong className="text-ink">{doneTotal} of {totalSteps}</strong> steps marked done. Your progress is saved in this browser only.
        </p>
      </aside>

      <main id="main" className="lg:ml-[310px]">
        <RoomView key={room.id} room={room} done={done} toggleStep={toggleStep} go={go} />
        <footer className="border-t border-line bg-white px-5 py-8 text-[0.9rem] leading-relaxed text-ink-2">
          <div className="mx-auto max-w-[960px] space-y-2">
            <p className="m-0">
              Data: CIC-IDS2017 by the Canadian Institute for Cybersecurity (Sharafaldin, Lashkari and Ghorbani, "Toward Generating a New Intrusion Detection Dataset and Intrusion Traffic Characterization", ICISSP 2018), used through the Hugging Face copy <code className="font-mono">rdpahalavan/CIC-IDS2017</code> (Apache-2.0).
            </p>
            <p className="m-0">
              Every number on this site comes from running the code in the <code className="font-mono">ai-project</code> folder on the full dataset. Your own numbers may differ a little.
            </p>
            <p className="m-0">
              Created by <a className="font-bold text-ink" href="https://sazid63.netlify.app" target="_blank" rel="noopener noreferrer">Sajid Hossain</a>.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
