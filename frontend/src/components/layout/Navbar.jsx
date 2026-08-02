import { FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 font-semibold text-slate-800 hover:text-blue-600 transition"
          >
            <FaUserCircle className="h-6 w-6 text-slate-400" />
            <span className="hidden sm:inline">{user?.name || "User"}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
