import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { NAV_LINKS } from "../../config/constants";

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <Link to={user ? "/dashboard" : "/login"}>
          <img src="/teclab-horizontal-color.svg" alt="TecLab" className="h-8 w-auto sm:h-10" />
        </Link>

        {user ? (
          <>
            {/* Escritorio */}
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-gray-600">{user.nombre}</span>
              <button
                onClick={handleSignOut}
                className="rounded-md border border-blue-700 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                Cerrar sesión
              </button>
            </div>

            {/* Botón móvil */}
            <button
              onClick={() => setOpen(!open)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              to="/login"
              className="rounded-md px-2 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 sm:px-4"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 sm:px-4"
            >
              Registrarse
            </Link>
          </nav>
        )}
      </div>

      {/* Menú móvil (con sesión) */}
      {user && open && (
        <div className="border-t border-gray-200 px-3 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={mobileLinkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-600">{user.nombre}</span>
            <button
              onClick={handleSignOut}
              className="rounded-md border border-blue-700 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}