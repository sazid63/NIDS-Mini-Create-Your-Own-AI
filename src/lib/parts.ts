// Splits a real Python/Docker/requirements file into numbered parts.
// The files in ai-project/ mark each part with a line like:  # ▶ PART 3: Some title
// The website reads those same files, so the code you see is the code that was tested.

export type Part = { n: number; title: string; code: string };

const MARKER = /^\s*# ▶ PART (\d+): (.*)$/;

export function parseParts(raw: string): Part[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const parts: Part[] = [];
  let head: string[] = [];
  let current: Part | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) {
      current.code = trimBlank(buffer).join('\n');
      parts.push(current);
    }
  };

  for (const line of lines) {
    const m = line.match(MARKER);
    if (m) {
      flush();
      current = { n: Number(m[1]), title: m[2].trim(), code: '' };
      buffer = [];
    } else if (current) {
      buffer.push(line);
    } else {
      head.push(line);
    }
  }
  flush();

  // Anything before the first marker that is real code (like imports) becomes part 0.
  const headCode = trimBlank(head);
  const hasCode = headCode.some((l) => l.trim() !== '' && !l.trim().startsWith('#'));
  if (hasCode) {
    parts.unshift({ n: 0, title: 'The tools this file borrows', code: headCode.join('\n') });
  }
  return parts;
}

function trimBlank(lines: string[]): string[] {
  let a = 0;
  let b = lines.length;
  while (a < b && lines[a].trim() === '') a++;
  while (b > a && lines[b - 1].trim() === '') b--;
  return lines.slice(a, b);
}

export function wholeFile(raw: string): string {
  return raw.replace(/\r\n/g, '\n').replace(/^\s*# ▶ PART \d+: .*\n/gm, '');
}
