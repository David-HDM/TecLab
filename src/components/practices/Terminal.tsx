import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { LineKind, TerminalLine } from "../../types/practice";

export interface TerminalTheme {
  /** Punto de la barra superior */
  dot: string;
  /** Color de la salida normal */
  out: string;
  /** Color del prompt */
  prompt: string;
  /** Color del texto que se escribe */
  input: string;
}

interface TerminalProps {
  title: string;
  detail: string;
  theme: TerminalTheme;
  lines: TerminalLine[];
  prompt: string;
  history: string[];
  onSubmit: (command: string) => void;
  className?: string;
}

const LINE_CLASS: Record<LineKind, string> = {
  out: "",
  cmd: "text-slate-200 font-bold mt-1",
  err: "text-rose-400",
  syslog: "text-amber-300 font-semibold my-1",
  ok: "text-emerald-400 font-bold",
  warn: "text-amber-300 font-bold",
  muted: "text-slate-500 pt-1",
  sep: "border-b border-slate-900 my-2",
};

export default function Terminal({
  title,
  detail,
  theme,
  lines,
  prompt,
  history,
  onSubmit,
  className = "",
}: TerminalProps) {
  const [value, setValue] = useState("");
  const [cursor, setCursor] = useState(history.length);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantener la vista al final de la salida
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Al enviar un comando, el historial de flechas vuelve al final
  useEffect(() => {
    setCursor(history.length);
  }, [history]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cursor > 0) {
        setCursor(cursor - 1);
        setValue(history[cursor - 1]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor < history.length - 1) {
        setCursor(cursor + 1);
        setValue(history[cursor + 1]);
      } else {
        setCursor(history.length);
        setValue("");
      }
    }
  };

  return (
    <section
      className={`flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-black font-mono text-sm shadow-2xl ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
          {title}
        </span>
        <span>{detail}</span>
      </div>

      <div ref={outputRef} className={`custom-scroll flex-1 space-y-1.5 overflow-y-auto p-4 ${theme.out}`}>
        {lines.map((line, i) =>
          line.kind === "sep" ? (
            <div key={i} className={LINE_CLASS.sep} />
          ) : (
            <div key={i} className={`whitespace-pre-wrap break-words ${LINE_CLASS[line.kind]}`}>
              {line.text}
            </div>
          )
        )}
      </div>

      <div className="flex shrink-0 items-center space-x-2 border-t border-slate-800 bg-slate-950 p-3">
        <span className={`select-none font-bold ${theme.prompt}`}>{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un comando..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Línea de comandos"
          className={`flex-1 bg-transparent font-mono text-sm focus:outline-none ${theme.input}`}
        />
      </div>
    </section>
  );
}
