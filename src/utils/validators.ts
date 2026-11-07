const LETTERS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
const NAME_REGEX = new RegExp(`^[${LETTERS}]+( [${LETTERS}]+)*$`);
const EMAIL_REGEX = /^[A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

/* ---------- Filtros mientras se escribe ---------- */

export function sanitizeName(value: string, max: number): string {
  return value
    .replace(new RegExp(`[^${LETTERS} ]`, "g"), "")
    .replace(/^ +/, "")
    .replace(/ {2,}/g, " ")
    .slice(0, max);
}

export function sanitizeDigits(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

/* ---------- Validaciones (devuelven "" si es válido) ---------- */

export function validateName(value: string, label: string, max: number): string {
  const v = value.trim();
  if (!v) return `Ingresa ${label}.`;
  if (v.length > max) return `Máximo ${max} caracteres.`;
  if (!NAME_REGEX.test(v)) return "Solo se permiten letras.";
  return "";
}

export function validateSemester(value: string): string {
  if (!value) return "Selecciona tu semestre.";
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 12) return "Selecciona un semestre.";
  return "";
}

export function validateControlNumber(value: string, now: Date = new Date()): string {
  if (!value) return "Ingresa tu número de control.";
  if (!/^\d{8}$/.test(value)) return "Debe tener exactamente 8 dígitos.";

  const current = now.getFullYear();
  const year = 2000 + Number(value.slice(0, 2));
  if (year > current || year < current - 6) {
    const min = String(current - 6).slice(2);
    const max = String(current).slice(2);
    return `El número de control no es válido.`;
  }
  return "";
}

export function validateEmail(value: string): string {
  const v = value.trim();
  if (!v) return "Ingresa tu correo electrónico.";
  if (v.length > 254 || !EMAIL_REGEX.test(v)) return "Ingresa un correo electrónico válido.";
  return "";
}

export function validateEmailConfirm(email: string, confirm: string): string {
  if (!confirm.trim()) return "Confirma tu correo electrónico.";
  if (confirm.trim().toLowerCase() !== email.trim().toLowerCase()) return "Los correos no coinciden.";
  return "";
}

/* ---------- Contraseña (reglas de Supabase) ---------- */

export function passwordChecks(password: string) {
  return [
    { label: `Mínimo ${PASSWORD_MIN} caracteres`, ok: password.length >= PASSWORD_MIN },
    { label: "Una letra minúscula", ok: /[a-z]/.test(password) },
    { label: "Una letra mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Un número", ok: /\d/.test(password) },
    { label: "Un símbolo (por ejemplo ! @ # $ %)", ok: SYMBOL_REGEX.test(password) },
  ];
}

export function validatePassword(password: string): string {
  if (!password) return "Ingresa una contraseña.";
  if (!passwordChecks(password).every((c) => c.ok)) return "La contraseña no cumple los requisitos.";
  return "";
}

export function validatePasswordConfirm(password: string, confirm: string): string {
  if (!confirm) return "Confirma tu contraseña.";
  if (confirm !== password) return "Las contraseñas no coinciden.";
  return "";
}