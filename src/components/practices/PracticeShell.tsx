import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import Button from "../ui/Button";
import InlineText from "../ui/InlineText";
import Modal from "../ui/Modal";
import Terminal, { type TerminalTheme } from "./Terminal";
import { ACCENT } from "./accent";
import type { PracticeLab } from "../../hooks/usePracticeSession";
import type { Practice } from "../../types/practice";

interface PracticeShellProps {
  practice: Practice;
  lab: PracticeLab;
  theme: TerminalTheme;
  /** Grafo de React Flow */
  topology: ReactNode;
  /** Indicador de estado junto al título de la topología */
  badge?: ReactNode;
}

const CARD = "rounded-xl border border-slate-800 bg-slate-900";

export default function PracticeShell({ practice, lab, theme, topology, badge }: PracticeShellProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const accent = ACCENT[practice.color];
  const { session, run, reset, feedback, prompt } = lab;

  return (
    <div className="rounded-2xl bg-slate-950 p-3 text-slate-100 sm:p-4">
      <div className="grid grid-cols-1 gap-4 lg:h-[calc(100vh-20rem)] lg:min-h-[560px] lg:grid-cols-12">
        {/* ---------- Panel izquierdo: guía, topología y objetivos ---------- */}
        <section className="custom-scroll flex flex-col space-y-4 lg:col-span-5 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-2">
          <div className={`${CARD} shrink-0 p-4 text-xs shadow-sm`}>
            <div className="flex items-start justify-between gap-2">
              <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${accent.badge}`}>
                {practice.modulo}
              </span>
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="rounded border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              >
                Reiniciar
              </button>
            </div>
            <h2 className="mt-1 text-sm font-bold text-white">{practice.tituloGuiado}</h2>
            <p className="mt-1 leading-relaxed text-slate-400">{practice.introduccion}</p>
          </div>

          {practice.informacion && (
            <div className={`${CARD} shrink-0 p-4 text-xs`}>
              <h3 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${accent.heading}`}>
                {practice.informacion.titulo}
              </h3>
              <div className="space-y-1 leading-relaxed text-slate-300">
                {practice.informacion.lineas.map((linea) => (
                  <p key={linea}>
                    <InlineText text={linea} codeClass={accent.code} />
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className={`${CARD} shrink-0 p-4`}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Topología Física & Enlace Lógico
              </h3>
              {badge}
            </div>
            {topology}
          </div>

          <div className={`${CARD} shrink-0 space-y-2 p-4 text-xs`}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                Objetivos de la Práctica
              </h3>
              <span className="text-[11px] text-slate-400">
                {session.completed.length}/{practice.objetivos.length}
              </span>
            </div>

            {practice.objetivos.map((o) => {
              const done = session.completed.includes(o.id);
              return (
                <div
                  key={o.id}
                  className={
                    done
                      ? "rounded border border-emerald-800 bg-emerald-950/80 p-2 font-bold text-emerald-300"
                      : "rounded border border-slate-700/50 bg-slate-800/50 p-2 text-slate-400"
                  }
                >
                  {o.id}. {o.texto} <code className={accent.code}>{o.comando}</code>
                </div>
              );
            })}

            <div className={`mt-4 rounded-lg border p-3 ${accent.note}`}>
              <p className={`mb-1 font-semibold ${accent.noteTitle}`}>{practice.tituloNota}</p>
              <p>
                <InlineText text={feedback} codeClass="text-amber-300" />
              </p>
            </div>

            <Link
              to={`/evaluacion/${practice.topicId}`}
              className={`block w-full rounded-lg py-2 text-center font-bold text-white transition-colors ${accent.button}`}
            >
              Ir a la evaluación de reforzamiento →
            </Link>
          </div>
        </section>

        {/* ---------- Panel derecho: consola ---------- */}
        <Terminal
          className="h-[28rem] lg:col-span-7 lg:h-full lg:min-h-0"
          title={practice.consola.titulo}
          detail={practice.consola.detalle}
          theme={theme}
          lines={session.lines}
          prompt={prompt}
          history={session.history}
          onSubmit={run}
        />
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="¿Reiniciar la práctica?">
        <p className="text-gray-600">Se borrará el avance y el historial de la consola de esta práctica.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmReset(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              reset();
              setConfirmReset(false);
            }}
          >
            Reiniciar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
