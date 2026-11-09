import type { AccentColor } from "../../types/practice";

/* Clases completas (no se arman con plantillas) para que Tailwind las detecte */
export const ACCENT: Record<
  AccentColor,
  { code: string; badge: string; heading: string; note: string; noteTitle: string; button: string }
> = {
  blue: {
    code: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    heading: "text-blue-400",
    note: "bg-blue-950/40 border-blue-900/50 text-blue-200",
    noteTitle: "text-blue-400",
    button: "bg-blue-600 hover:bg-blue-500",
  },
  purple: {
    code: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    heading: "text-purple-400",
    note: "bg-purple-950/40 border-purple-900/50 text-purple-200",
    noteTitle: "text-purple-400",
    button: "bg-purple-600 hover:bg-purple-500",
  },
  emerald: {
    code: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    heading: "text-emerald-400",
    note: "bg-emerald-950/40 border-emerald-900/50 text-emerald-200",
    noteTitle: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500",
  },
};
