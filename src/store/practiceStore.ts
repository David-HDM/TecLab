import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { engines } from "../utils/practiceEngines";
import type { PracticeSession } from "../types/practice";

const MAX_LINES = 400;
const MAX_HISTORY = 100;

/** Cada usuario tiene su propia sesión por práctica */
export const sessionKey = (userId: string, practiceId: string) => `${userId}:${practiceId}`;

export function createSession(practiceId: string): PracticeSession {
  const engine = engines[practiceId];
  return {
    device: engine.createDevice(),
    lines: engine.banner,
    history: [],
    completed: [],
    startedAt: Date.now(),
    completedAt: null,
  };
}

const mergeObjectives = (prev: number[], add: number[]) =>
  Array.from(new Set([...prev, ...add])).sort((a, b) => a - b);

/** Marca la fecha de término la primera vez que se cumple todo (y la conserva después) */
function withCompletion(practiceId: string, s: PracticeSession): PracticeSession {
  const done = engines[practiceId].isComplete(s.completed, s.device);
  return { ...s, completedAt: done ? s.completedAt ?? Date.now() : s.completedAt };
}

interface PracticeStore {
  sessions: Record<string, PracticeSession>;
  /** Crea la sesión si no existe */
  ensure: (userId: string, practiceId: string) => void;
  /** Ejecuta un comando escrito en la consola */
  run: (userId: string, practiceId: string, input: string) => void;
  /** Resuelve el evento diferido del equipo (p. ej. la IP que entrega el DHCP) */
  tick: (userId: string, practiceId: string) => void;
  /** Borra la sesión y empieza de nuevo */
  reset: (userId: string, practiceId: string) => void;
}

export const usePracticeStore = create<PracticeStore>()(
  persist(
    (set) => ({
      sessions: {},

      ensure: (userId, practiceId) => {
        const key = sessionKey(userId, practiceId);
        set((state) =>
          state.sessions[key] ? state : { sessions: { ...state.sessions, [key]: createSession(practiceId) } }
        );
      },

      run: (userId, practiceId, input) => {
        const raw = input.trim();
        const engine = engines[practiceId];
        if (!raw || !engine) return;
        const key = sessionKey(userId, practiceId);

        set((state) => {
          const s = state.sessions[key] ?? createSession(practiceId);
          const prompt = engine.prompt(s.device);
          const res = engine.run(s.device, raw, s.completed);

          const lines = res.clear
            ? []
            : [...s.lines, { kind: "cmd" as const, text: `${prompt} ${raw}` }, ...res.lines].slice(-MAX_LINES);

          const next = withCompletion(practiceId, {
            ...s,
            device: res.device,
            lines,
            history: [...s.history, raw].slice(-MAX_HISTORY),
            completed: mergeObjectives(s.completed, res.completed),
          });
          return { sessions: { ...state.sessions, [key]: next } };
        });
      },

      tick: (userId, practiceId) => {
        const engine = engines[practiceId];
        const key = sessionKey(userId, practiceId);
        if (!engine?.onTimer) return;

        set((state) => {
          const s = state.sessions[key];
          if (!s || engine.timer?.(s.device) == null) return state;
          const res = engine.onTimer!(s.device, s.completed);
          const next = withCompletion(practiceId, {
            ...s,
            device: res.device,
            lines: [...s.lines, ...res.lines].slice(-MAX_LINES),
            completed: mergeObjectives(s.completed, res.completed),
          });
          return { sessions: { ...state.sessions, [key]: next } };
        });
      },

      reset: (userId, practiceId) => {
        const key = sessionKey(userId, practiceId);
        set((state) => ({ sessions: { ...state.sessions, [key]: createSession(practiceId) } }));
      },
    }),
    {
      name: "teclab-practicas", // clave en localStorage
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
