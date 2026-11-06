import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700";

export default function Login() {
  const [email, setEmail] = useState("");
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
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("Invalid login credentials")
          ? "Correo o contraseña incorrectos."
          : msg.includes("Email not confirmed")
          ? "Debes confirmar tu correo antes de iniciar sesión."
          : "No se pudo iniciar sesión. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer >
      <div>
        
      </div>
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <img src="/teclab-logo-pack/svg/teclab-vertical-lema-color.svg" alt="TecLab" />
        <h1 className="text-2xl font-bold text-blue-900 mt-8">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>
          <Button type="submit" fullWidth>
            Entrar
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-blue-700 hover:underline">
            Regístrate
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/recuperar" className="font-semibold text-blue-700 hover:underline">
            Recupérala aquí
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}