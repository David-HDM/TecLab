import type { SelectHTMLAttributes } from "react";

interface DesplegableFiltroProps extends SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean;
}


// Selector reutilizable con estilo consistente y ancho configurable.
export default function DesplegableFiltro({
  fullWidth = false,
  className = "",
  ...props
}: DesplegableFiltroProps) {
  return (
    <select
      className={`rounded-md px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    />
  );
}
