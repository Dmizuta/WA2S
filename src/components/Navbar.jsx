import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600" />
          <span className="font-bold tracking-tight">A2 Sports</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1 rounded ${isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"}`
            }
          >
            Início
          </NavLink>
          <NavLink
            to="/monte-o-seu"
            className={({ isActive }) =>
              `px-3 py-1 rounded ${isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"}`
            }
          >
            Monte o Seu
          </NavLink>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
