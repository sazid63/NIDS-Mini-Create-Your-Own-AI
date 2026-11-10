import type { ReactNode } from 'react';

export type PartSays = {
  /** Plain-words explanation of the whole part. */
  says: string;
  /** Optional: the key lines inside the part, each with its own plain-words meaning. */
  lines?: { c: string; s: string }[];
};

export type CodeSpec = {
  /** File name the learner saves, for example model.py */
  file: string;
  /** The real file's text (imported with ?raw from ai-project/). */
  raw: string;
  /** Explanation for each numbered part, keyed by the part number. Part 0 is the "tools it borrows" block at the top of a file. */
  says: Record<number, PartSays>;
};

export type Command = { cmd: string; says: string };

export type Step = {
  id: string;
  num: string;
  title: string;
  /** Why we do this, in plain words. */
  why: ReactNode;
  commands?: Command[];
  code?: CodeSpec;
  /** What the learner should see after running the commands. */
  see?: { label: string; out: string };
  /** Anything else worth showing inside the step (tables, extra pictures). */
  extra?: ReactNode;
  /** A friendly "stuck?" hint. */
  stuck?: ReactNode;
};

export type Room = {
  id: number;
  slug: string;
  name: string;
  /** Big opener title */
  title: string;
  /** Short name for the map */
  short: string;
  promise: string;
  outcomes: string[];
  plate: ReactNode;
  caption: string;
  words: { term: string; says: string }[];
  steps: Step[];
  done: string;
};
