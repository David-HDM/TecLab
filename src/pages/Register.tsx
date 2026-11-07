import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { CARRERAS, SEMESTRES } from "../config/constants";
import {
  PASSWORD_MAX,
  passwordChecks,
  sanitizeDigits,
  sanitizeName,
  validateControlNumber,
  validateEmail,
  validateEmailConfirm,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validateSemester,
} from "../utils/validators";

const initialForm = {
  nombres: "",
  apellido_paterno: "",
  apellido_materno: "",
  carrera: "",
  semestre: "",
  numero_control: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
};
type Form = typeof initialForm;
type FieldName = keyof Form;

const FIELD_ORDER: FieldName[] = [
  "nombres",
  "apellido_paterno",
  "apellido_materno",
  "carrera",
  "semestre",
  "numero_control",
  "email",
  "confirmEmail",
  "password",
  "confirmPassword",
];

const sanitizers: Partial<Record<FieldName, (v: string) => string>> = {
  nombres: (v) => sanitizeName(v, 35),
  apellido_paterno: (v) => sanitizeName(v, 20),
  apellido_materno: (v) => sanitizeName(v, 20),
  numero_control: (v) => sanitizeDigits(v, 8),
};

const inputClass = (hasError: boolean) =>
  `mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-700 focus:ring-blue-700"
  }`;

function Field({ id, label, error, children }: { id: string; label: string; error: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState<Form>(initialForm);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  const errors: Record<FieldName, string> = {
    nombres: validateName(form.nombres, "tu nombre", 35),
    apellido_paterno: validateName(form.apellido_paterno, "tu apellido paterno", 20),
    apellido_materno: validateName(form.apellido_materno, "tu apellido materno", 20),
    carrera: form.carrera ? "" : "Selecciona tu carrera.",
    semestre: validateSemester(form.semestre),
    numero_control: validateControlNumber(form.numero_control),
    email: validateEmail(form.email),
    confirmEmail: validateEmailConfirm(form.email, form.confirmEmail),
    password: validatePassword(form.password),
    confirmPassword: validatePasswordConfirm(form.password, form.confirmPassword),
  };

  if (user) return <Navigate to="/dashboard" replace />;

  if (confirmationSent) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-blue-900">Revisa tu correo</h1>
          <p className="mt-4 text-gray-700">
            Te enviamos un enlace de confirmación a <strong>{form.email}</strong>. Ábrelo para activar tu cuenta y
            después inicia sesión.
          </p>
          <Link to="/login" className="mt-6 inline-block font-semibold text-blue-700 hover:underline">
            Ir a iniciar sesión
          </Link>
        </div>
      </PageContainer>
    );
  }

  const show = (f: FieldName) => (touched[f] || submitted ? errors[f] : "");
  const touch = (f: FieldName) => () => setTouched((t) => ({ ...t, [f]: true }));

  const handleChange =
    (field: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const sanitize = sanitizers[field];
      const value = sanitize ? sanitize(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { needsEmailConfirmation } = await signUp({
        nombres: form.nombres.trim(),
        apellido_paterno: form.apellido_paterno.trim(),
        apellido_materno: form.apellido_materno.trim(),
        carrera: form.carrera,
        semestre: Number(form.semestre),
        numero_control: form.numero_control,
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (needsEmailConfirmation) {
        setConfirmationSent(true);
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? "";
      setServerError(
        msg.includes("already registered")
        ? "Ya existe una cuenta con ese correo."
        : msg.includes("Database error saving new user")
        ? "No se pudo crear la cuenta. Verifica tus datos; es posible que el número de control ya esté registrado."
        : msg.toLowerCase().includes("rate limit")
        ? "Demasiados intentos. Espera unos minutos."
        : msg.toLowerCase().includes("password")
        ? "La contraseña no cumple los requisitos."
        : msg || "No se pudo crear la cuenta."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-900">Crear cuenta</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <Field id="nombres" label="Nombre(s)" error={show("nombres")}>
            <input
              id="nombres"
              value={form.nombres}
              onChange={handleChange("nombres")}
              onBlur={touch("nombres")}
              maxLength={35}
              autoComplete="given-name"
              aria-invalid={!!show("nombres")}
              className={inputClass(!!show("nombres"))}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="apellido_paterno" label="Apellido paterno" error={show("apellido_paterno")}>
              <input
                id="apellido_paterno"
                value={form.apellido_paterno}
                onChange={handleChange("apellido_paterno")}
                onBlur={touch("apellido_paterno")}
                maxLength={20}
                autoComplete="family-name"
                aria-invalid={!!show("apellido_paterno")}
                className={inputClass(!!show("apellido_paterno"))}
              />
            </Field>
            <Field id="apellido_materno" label="Apellido materno" error={show("apellido_materno")}>
              <input
                id="apellido_materno"
                value={form.apellido_materno}
                onChange={handleChange("apellido_materno")}
                onBlur={touch("apellido_materno")}
                maxLength={20}
                aria-invalid={!!show("apellido_materno")}
                className={inputClass(!!show("apellido_materno"))}
              />
            </Field>
          </div>

          <Field id="carrera" label="Carrera" error={show("carrera")}>
            <select
              id="carrera"
              value={form.carrera}
              onChange={handleChange("carrera")}
              onBlur={touch("carrera")}
              aria-invalid={!!show("carrera")}
              className={inputClass(!!show("carrera"))}
            >
              <option value="" disabled>
                Selecciona tu carrera
              </option>
              {CARRERAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="semestre" label="Semestre" error={show("semestre")}>
              <select
                id="semestre"
                value={form.semestre}
                onChange={handleChange("semestre")}
                onBlur={touch("semestre")}
                aria-invalid={!!show("semestre")}
                className={inputClass(!!show("semestre"))}
              >
                <option value="" disabled>
                  Selecciona tu semestre
                </option>
                {SEMESTRES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="numero_control" label="Número de control" error={show("numero_control")}>
              <input
                id="numero_control"
                inputMode="numeric"
                value={form.numero_control}
                onChange={handleChange("numero_control")}
                onBlur={touch("numero_control")}
                maxLength={8}
                placeholder="8 dígitos"
                aria-invalid={!!show("numero_control")}
                className={inputClass(!!show("numero_control"))}
              />
            </Field>
          </div>

          <Field id="email" label="Correo electrónico" error={show("email")}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={touch("email")}
              maxLength={254}
              autoComplete="email"
              aria-invalid={!!show("email")}
              className={inputClass(!!show("email"))}
            />
          </Field>

          <Field id="confirmEmail" label="Confirmar correo electrónico" error={show("confirmEmail")}>
            <input
              id="confirmEmail"
              type="email"
              value={form.confirmEmail}
              onChange={handleChange("confirmEmail")}
              onBlur={touch("confirmEmail")}
              maxLength={254}
              autoComplete="off"
              aria-invalid={!!show("confirmEmail")}
              className={inputClass(!!show("confirmEmail"))}
            />
          </Field>

          <Field id="password" label="Contraseña" error={show("password")}>
            <PasswordInput
              id="password"
              value={form.password}
              onChange={handleChange("password")}
              onBlur={touch("password")}
              maxLength={PASSWORD_MAX}
              autoComplete="new-password"
              aria-invalid={!!show("password")}
            />
            {form.password.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {passwordChecks(form.password).map((c) => (
                  <li key={c.label} className={c.ok ? "text-green-700" : "text-gray-500"}>
                    {c.ok ? "✓" : "○"} {c.label}
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <Field id="confirmPassword" label="Confirmar contraseña" error={show("confirmPassword")}>
            <PasswordInput
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={touch("confirmPassword")}
              maxLength={PASSWORD_MAX}
              autoComplete="new-password"
              aria-invalid={!!show("confirmPassword")}
            />
          </Field>

          {serverError && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {serverError}
            </p>
          )}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-blue-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}