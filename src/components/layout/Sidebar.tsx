import { NavLink } from "react-router";
import { NAV_LINKS } from "../../config/constants";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white md:block">
      <nav className="sticky top-16 flex flex-col gap-1 p-4">
        {NAV_LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}