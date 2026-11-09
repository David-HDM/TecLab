import { Fragment } from "react";

interface InlineTextProps {
  text: string;
  /** Clases del <code>. Por defecto, el estilo para fondos claros */
  codeClass?: string;
  className?: string;
}

// `código`, *cursiva* y **negritas**
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
const LIGHT_CODE = "rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.85em] text-blue-800";

export default function InlineText({ text, codeClass = LIGHT_CODE, className }: InlineTextProps) {
  // Con un grupo de captura, split() deja los fragmentos con formato en los índices impares
  const parts = text.split(TOKEN);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`")) {
          return (
            <code key={i} className={codeClass}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <em key={i}>{part.slice(1, -1)}</em>;
      })}
    </span>
  );
}
