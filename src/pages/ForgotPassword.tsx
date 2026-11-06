import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import { requestPasswordReset } from "../services/authService";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch {
      setError("No se pudo enviar el correo. Intenta de nuevo en unos minutos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-900">Recuperar contraseña</h1>

        {sent ? (
          <p className="mt-6 text-gray-700">
            Si el correo está registrado, recibirás un enlace para restablecer tu contraseña. Revisa también la
            carpeta de spam.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-sm text-gray-600">
              Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.
            </p>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar enlace"}
            </Button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="font-semibold text-blue-700 hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}