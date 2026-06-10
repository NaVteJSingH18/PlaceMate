import { FaBell } from "react-icons/fa";

function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Training and placement cell
        </p>
        <h2 className="text-lg font-bold text-slate-950">Welcome back</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          type="button"
        >
          <FaBell />
        </button>

        <span className="hidden font-semibold text-slate-800 sm:inline">
          Navtej Singh
        </span>
      </div>
    </header>
  );
}

export default Navbar;
