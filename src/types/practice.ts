export type AccentColor = "blue" | "purple" | "emerald";

export interface PracticeObjective {
  id: number;
  texto: string;
  comando: string;
}

export interface Practice {
  id: string;
  topicId: string;
  titulo: string;
  descripcion: string;
  sigla: string;
  color: AccentColor;
  modulo: string;
  categoria: string;
  tituloGuiado: string;
  introduccion: string;
  tituloNota: string;
  informacion?: { titulo: string; lineas: string[] };
  consola: { titulo: string; detalle: string };
  objetivos: PracticeObjective[];
}

/* ------------------------------------------------------------------ */
/* Simulador de consola y sesión de práctica                           */
/* ------------------------------------------------------------------ */

export type LineKind = "out" | "cmd" | "err" | "syslog" | "ok" | "warn" | "muted" | "sep";

export interface TerminalLine {
  kind: LineKind;
  text: string;
}

/** Estado del equipo simulado. Solo valores primitivos para poder guardarlo en localStorage. */
export type DeviceState = Record<string, string | number | boolean>;

export interface PracticeSession {
  device: DeviceState;
  lines: TerminalLine[];
  history: string[];
  completed: number[];
  startedAt: number;
  completedAt: number | null;
}

export interface EngineResult {
  device: DeviceState;
  lines: TerminalLine[];
  /** Objetivos que este comando acaba de cumplir */
  completed: number[];
  clear?: boolean;
}

export interface PracticeEngine {
  totalObjectives: number;
  createDevice: () => DeviceState;
  banner: TerminalLine[];
  prompt: (device: DeviceState) => string;
  run: (device: DeviceState, input: string, done: number[]) => EngineResult;
  /** Texto de la nota pedagógica, calculado a partir del avance */
  feedback: (done: number[], device: DeviceState) => string;
  isComplete: (done: number[], device: DeviceState) => boolean;
  /** Milisegundos que faltan para un evento diferido (p. ej. la respuesta DHCP), o null */
  timer?: (device: DeviceState) => number | null;
  onTimer?: (device: DeviceState, done: number[]) => EngineResult;
}
