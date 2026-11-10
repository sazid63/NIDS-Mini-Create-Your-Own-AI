import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { parseParts, wholeFile } from '../lib/parts';
import type { CodeSpec, Command } from '../data/types';
import { RESULTS } from '../data/results';
import { WHY } from '../data/why';

/* ---------- Copy button ---------- */
export function CopyButton({ text, label = 'Copy', dark = false }: { text: string; label?: string; dark?: boolean }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 1800);
    } catch {
      // Clipboard can be blocked; the text is still selectable on the page.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors ${
        dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-ink/[0.07] text-ink hover:bg-ink/[0.13]'
      }`}
      aria-live="polite"
    >
      {done ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.25} />}
      {done ? 'Copied' : label}
    </button>
  );
}

/* ---------- One terminal command and what it does ---------- */
export function CommandCard({ c }: { c: Command }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="flex items-center gap-3 bg-ink px-4 py-2.5">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre py-1 text-[0.95rem] text-white">
          <span aria-hidden className="select-none pr-2 text-[#8d94b6]">$</span>
          {c.cmd}
        </code>
        <CopyButton text={c.cmd} dark />
      </div>
      <p className="px-4 py-3 text-[1rem] leading-relaxed text-ink">
        <strong className="font-bold">What it does: </strong>
        {c.says}
      </p>
    </div>
  );
}

/* ---------- Output the learner should see ---------- */
export function Screen({ label, out }: { label: string; out: string }) {
  return (
    <figure className="m-0">
      <figcaption className="mb-2 text-[0.95rem] font-bold text-ink">{label}</figcaption>
      <pre className="m-0 overflow-x-auto rounded-lg bg-[#0e1124] p-4 text-[0.88rem] leading-relaxed text-[#cfe9e5]">{out}</pre>
    </figure>
  );
}

/* ---------- Code, cut into numbered colour parts ---------- */
export function CodeBreakdown({ spec }: { spec: CodeSpec }) {
  const parts = parseParts(spec.raw);
  return (
    <div className="rounded-xl border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="m-0 text-sm text-ink-2">Make a new file and save it as</p>
          <p className="m-0 break-all font-mono text-base font-bold text-ink">{spec.file}</p>
        </div>
        <CopyButton text={wholeFile(spec.raw)} label="Copy the whole file" />
      </div>
      <p className="m-0 border-b border-line bg-gallery/60 px-4 py-2.5 text-[0.95rem] text-ink-2">
        The code is cut into {parts.length} colour-coded parts. Each part has its explanation next to it. Copy the whole file, or read it part by part.
      </p>
      <ol className="m-0 list-none p-0">
        {parts.map((p) => {
          const says = spec.says[p.n];
          if (!says && import.meta.env.DEV) console.warn(`Missing explanation for ${spec.file} part ${p.n}`);
          return (
            <li key={p.n} className={`part-${p.n % 8} grid gap-4 border-b border-line p-4 last:border-b-0 `}>
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--p)] font-display text-lg font-extrabold text-[var(--on-p)]" aria-hidden>
                    {p.n}
                  </span>
                  <h4 className="m-0 font-display text-[1.15rem] font-bold leading-tight text-ink">
                    <span className="sr-only">Part {p.n}: </span>
                    {p.title}
                  </h4>
                </div>
                <pre className="m-0 overflow-x-auto whitespace-pre rounded-md bg-[color-mix(in_oklab,var(--p)_16%,white)] p-3.5 text-[0.84rem] leading-relaxed">
                  <code>{p.code}</code>
                </pre>
              </div>
              <div className="min-w-0">
                <p className="m-0 mb-1 text-[0.95rem] font-bold text-ink">What this part does</p>
                <p className="m-0 text-[1rem] leading-relaxed text-ink">{says?.says ?? ''}</p>
                {WHY[`${spec.file}:${p.n}`] ? (
                  <>
                    <p className="m-0 mb-1 mt-3 text-[0.95rem] font-bold text-ink">Why we need it</p>
                    <p className="m-0 text-[1rem] leading-relaxed text-ink">{WHY[`${spec.file}:${p.n}`]}</p>
                  </>
                ) : null}
                {says?.lines && says.lines.length > 0 && (
                  <dl className="m-0 mt-3 grid gap-2">
                    {says.lines.map((l, i) => (
                      <div key={i} className="rounded-md bg-[color-mix(in_oklab,var(--p)_13%,white)] px-3 py-2">
                        <dt className="break-words font-mono text-[0.82rem] font-bold text-ink [overflow-wrap:anywhere]">{l.c}</dt>
                        <dd className="m-0 text-[0.95rem] leading-snug text-ink">{l.s}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- The real exam report card (Room 4 illustration) ---------- */
export function ReportCardPlate() {
  const rows = [...RESULTS.classes].sort((a, b) => b.f1 - a.f1);
  return (
    <div className="rounded-xl border border-line bg-white p-4 sm:p-6" role="group" aria-label="Exam report card: score for each of the 15 kinds of traffic">
      <p className="m-0 font-display text-[1.35rem] font-bold leading-snug">
        Overall, <span className="rounded bg-[var(--teal)] px-1.5">{RESULTS.accuracy}%</span> of answers were right. The fair grade is lower:{' '}
        <span className="rounded bg-[var(--amber)] px-1.5">{RESULTS.macroF1}%</span>
      </p>
      <p className="m-0 mt-1 text-[0.95rem] text-ink-2">Each bar is one kind of traffic. Longer bar = better score (100% is perfect). The number on the right is how many exam rows that kind had.</p>
      <ul className="m-0 mt-4 list-none space-y-1.5 p-0">
        {rows.map((r) => {
          const color = r.f1 >= 0.9 ? 'var(--teal)' : r.f1 >= 0.5 ? 'var(--amber)' : 'var(--coral)';
          return (
            <li key={r.name} className="grid grid-cols-[minmax(6.5rem,10rem)_1fr_auto] items-center gap-3 text-[0.92rem]">
              <span className="font-semibold leading-tight">{r.name.replace('Web Attack - ', 'Web: ')}</span>
              <span className="h-4 rounded-sm bg-gallery" role="img" aria-label={`${Math.round(r.f1 * 100)} percent`}>
                <span className="block h-full rounded-sm" style={{ width: `${Math.max(r.f1 * 100, 1.5)}%`, background: color }} />
              </span>
              <span className="tabular min-w-[7.5rem] whitespace-nowrap text-right text-ink-2 sm:min-w-[9.5rem]">
                <strong className="text-ink">{Math.round(r.f1 * 100)}%</strong> · {r.support.toLocaleString()} rows
              </span>
            </li>
          );
        })}
      </ul>
      <p className="m-0 mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.9rem] text-ink-2">
        <span><i className="mr-1.5 inline-block size-3 rounded-sm bg-[var(--teal)]" />90% or more: solid</span>
        <span><i className="mr-1.5 inline-block size-3 rounded-sm bg-[var(--amber)]" />50% to 90%: okay</span>
        <span><i className="mr-1.5 inline-block size-3 rounded-sm bg-[var(--coral)]" />under 50%: struggling</span>
      </p>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[68ch] space-y-3 text-[1.0625rem] leading-relaxed">{children}</div>;
}
