// Enlaces de navegación compartidos por el menú superior y lateral.
export const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/mis-laboratorios", label: "Mis Laboratorios" },
  { to: "/explorar", label: "Explorar" },
];

// Opciones de perfil utilizadas durante el registro.
export const CARRERAS = [
  "Ingeniería en Sistemas Computacionales",
  "Ingeniería Mecatrónica",
  "Ingeniería Industrial",
  "Ingeniería en Administración",
  "Ingeniería en Ciencia de Datos",
];

// Catálogo educativo y opciones de clasificación.
export const LABORATORIOS = [
  "Laboratorio de Redes y Telecomunicaciones",
  "Laboratorio de Desarrollo de Software",
  "Laboratorio de Inteligencia Artificial",
  "Laboratorio de Microcontroladores y Electrónica",
];

export const NIVELES = [
  "Principiante",
  "Intermedio",
  "Avanzado",
];

// Semestres ofrecidos en el formulario de registro.
export const SEMESTRES = Array.from({ length: 12 }, (_, i) => i + 1);
