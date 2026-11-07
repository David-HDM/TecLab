import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import PasswordInput from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { sanitizeDigits } from "../utils/validators";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700";

export default function Login() {
  const [numeroControl, setNumeroControl] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/dashboard";

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{8}$/.test(numeroControl)) {
      setError("El número de control debe tener 8 dígitos.");
      document.getElementById("numero_control")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await signIn(numeroControl, password);
      navigate(from, { replace: true });
    } catch (err) {
      const codigo = err instanceof Error ? err.message : "";
      setError(
        codigo === "credenciales_invalidas"
        ? "Número de control o contraseña incorrectos."
        : codigo === "email_no_confirmado"
        ? "Debes confirmar tu correo antes de iniciar sesión."
        : codigo === "demasiados_intentos"
        ? "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos."
        : "No se pudo iniciar sesión. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <img src="/teclab-logo-pack/svg/teclab-vertical-lema-color.svg" alt="TecLab" />
        <h1 className="text-2xl font-bold text-blue-900 mt-8">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="numero_control" className="block text-sm font-medium text-gray-700">
              Número de control
            </label>
            <input
              id="numero_control"
              inputMode="numeric"
              autoComplete="username"
              maxLength={8}
              required
              value={numeroControl}
              onChange={(e) => setNumeroControl(sanitizeDigits(e.target.value, 8))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <PasswordInput
              id="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right">
            <Link to="/recuperar" className="text-sm font-semibold text-blue-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-blue-700 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}