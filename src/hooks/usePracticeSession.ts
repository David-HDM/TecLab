import { useCallback, useEffect, useMemo } from "react";
import { useAuth } from "./useAuth";
import { createSession, sessionKey, usePracticeStore } from "../store/practiceStore";
import { engines } from "../utils/practiceEngines";

/** Sesión de práctica del usuario actual: estado persistente + acciones */
export function usePracticeSession(practiceId: string) {
  const { user } = useAuth();
  const userId = user?.id ?? "anon";
  const engine = engines[practiceId];
  const key = sessionKey(userId, practiceId);

  const stored = usePracticeStore((s) => s.sessions[key]);
  const ensure = usePracticeStore((s) => s.ensure);
  const runCommand = usePracticeStore((s) => s.run);
  const tickStore = usePracticeStore((s) => s.tick);
  const resetStore = usePracticeStore((s) => s.reset);

  // Mientras la sesión no existe en el store se muestra una sesión nueva
  const fallback = useMemo(() => createSession(practiceId), [practiceId]);
  const session = stored ?? fallback;

  useEffect(() => {
    if (!stored) ensure(userId, practiceId);
  }, [stored, ensure, userId, practiceId]);

  // Eventos diferidos del equipo (la IP del DHCP llega 1.2 s después del comando)
  useEffect(() => {
    const ms = engine.timer?.(session.device) ?? null;
    if (ms === null) return;
    const id = window.setTimeout(() => tickStore(userId, practiceId), ms);
    return () => window.clearTimeout(id);
  }, [engine, session.device, tickStore, userId, practiceId]);

  const run = useCallback((input: string) => runCommand(userId, practiceId, input), [runCommand, userId, practiceId]);
  const reset = useCallback(() => resetStore(userId, practiceId), [resetStore, userId, practiceId]);

  const progress = Math.round((session.completed.length / engine.totalObjectives) * 100);
  const complete = engine.isComplete(session.completed, session.device);
  const feedback = engine.feedback(session.completed, session.device);

  return { session, engine, run, reset, progress, complete, feedback, prompt: engine.prompt(session.device) };
}

export type PracticeLab = ReturnType<typeof usePracticeSession>;
