import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { updatePassword } from "../services/authService";
import {
  PASSWORD_MAX,
  passwordChecks,
  validatePassword,
  validatePasswordConfirm,
} from "../utils/validators";

export default function ResetPassword() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const passwordError = validatePassword(password);
  const confirmError = validatePasswordConfirm(password, confirm);
  const showPasswordError = touched.password || submitted ? passwordError : "";
  const showConfirmError = touched.confirm || submitted ? confirmError : "";

  if (loading) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (passwordError) {
      document.getElementById("password")?.focus();
      return;
    }
    if (confirmError) {
      document.getElementById("confirm")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("different from the old password")
          ? "La nueva contraseña debe ser distinta de la anterior."
          : "No se pudo actualizar la contraseña. Solicita un nuevo enlace."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-900">Nueva contraseña</h1>

        {!user ? (
          <div className="mt-6">
            <p className="text-gray-700">El enlace no es válido o ya expiró.</p>
            <Link to="/recuperar" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
              Solicitar un nuevo enlace
            </Link>
          </div>
        ) : done ? (
          <p className="mt-6 text-green-700">Contraseña actualizada. Redirigiendo...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                maxLength={PASSWORD_MAX}
                autoComplete="new-password"
                aria-invalid={!!showPasswordError}
              />
              {password.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm">
                  {passwordChecks(password).map((c) => (
                    <li key={c.label} className={c.ok ? "text-green-700" : "text-gray-500"}>
                      {c.ok ? "✓" : "○"} {c.label}
                    </li>
                  ))}
                </ul>
              )}
              {showPasswordError && <p className="mt-1 text-sm text-red-600">{showPasswordError}</p>}
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <PasswordInput
                id="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                maxLength={PASSWORD_MAX}
                autoComplete="new-password"
                aria-invalid={!!showConfirmError}
              />
              {showConfirmError && <p className="mt-1 text-sm text-red-600">{showConfirmError}</p>}
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar contraseña"}
            </Button>
          </form>
        )}
      </div>
    </PageContainer>
  );
}