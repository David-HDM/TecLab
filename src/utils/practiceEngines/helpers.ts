import type { TerminalLine } from "../../types/practice";

export const out = (text: string): TerminalLine => ({ kind: "out", text });
export const err = (text: string): TerminalLine => ({ kind: "err", text });
export const syslog = (text: string): TerminalLine => ({ kind: "syslog", text });
export const ok = (text: string): TerminalLine => ({ kind: "ok", text });
export const warn = (text: string): TerminalLine => ({ kind: "warn", text });
export const muted = (text: string): TerminalLine => ({ kind: "muted", text });
export const sep = (): TerminalLine => ({ kind: "sep", text: "" });

/** Minúsculas y espacios simples */
export const normalize = (input: string): string => input.trim().toLowerCase().replace(/\s+/g, " ");

/** Abreviaturas de IOS: "conf" es prefijo válido de "configure" (con un mínimo de letras) */
export const isPrefix = (token: string | undefined, full: string, min = 1): boolean =>
  !!token && token.length >= min && full.startsWith(token);

/** "gigabitEthernet 0/1", "gigabitethernet0/1", "gig0/1" o "g0/1" → "0/1" (o null si no es válida) */
export function parseGigabit(args: string[]): string | null {
  const m = args
    .join("")
    .toLowerCase()
    .match(/^(?:g|gi|gig|gigabit|gigabitethernet)(\d+\/\d+)$/);
  return m ? m[1] : null;
}
