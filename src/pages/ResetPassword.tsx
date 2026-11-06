import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { updatePassword } from "../services/authService";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700";

export default function ResetPassword() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (loading) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
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
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar contraseña"}
            </Button>
          </form>
        )}
      </div>
    </PageContainer>
  );
}