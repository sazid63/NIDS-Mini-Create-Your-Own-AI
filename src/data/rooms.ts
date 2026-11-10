import { roomsA } from './rooms-a';
import { roomsB } from './rooms-b';
import type { Room } from './types';

// Steps are numbered 1, 2, 3... in the order they are written, so numbers can never drift.
export const ROOMS: Room[] = [...roomsA, ...roomsB].map((r) => ({
  ...r,
  steps: r.steps.map((s, i) => ({ ...s, num: String(i + 1) })),
}));
