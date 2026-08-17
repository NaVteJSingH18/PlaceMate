import {
  FaBuilding,
  FaFileAlt,
  FaHome,
  FaUsers,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    name: "Companies",
    path: "/companies",
    icon: <FaBuilding />,
  },
  {
    name: "Students",
    path: "/students",
    icon: <FaUsers />,
  },
  {
    name: "Applications",
    path: "/applications",
    icon: <FaFileAlt />,
  },
];

import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  const displayedLinks = links.filter((link) => {
    if (link.name === "Students" && user?.role !== "admin") {
      return false;
    }
    return true;
  });

  return (
    <aside className="hidden w-[260px] lg:flex flex-col justify-between bg-[#1b2b5a] text-slate-300 p-6 shrink-0">
      <div>
        <div className="mb-8 p-1">
          <img 
            src="/src/assets/logo.png" 
            alt="PlaceMate Logo" 
            className="w-full h-auto max-h-28 object-contain object-left mix-blend-multiply transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to PM + Text if logo is not found
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl ring-1 ring-white/10 mb-2">
                  <div class="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white text-3xl shadow-lg mb-3">🎓</div>
                  <h1 class="text-xl font-bold tracking-tight text-white">PlaceMate</h1>
                </div>
              `;
            }} 
          />
        </div>

        <nav className="space-y-1.5">
          {displayedLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
                    : "text-blue-100/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Branding Removed per request */}
      <div className="mt-8 border-t border-slate-100 pt-4">
      </div>
    </aside>
  );
}

export default Sidebar;
