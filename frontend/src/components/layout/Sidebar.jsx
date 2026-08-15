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

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col justify-between border-r border-slate-200 bg-white p-5 text-slate-700 lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-purple-600 text-white font-bold text-xs">
            PM
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight text-slate-800">PlaceMate</h1>
            <p className="text-xs text-slate-500">Campus placement CRM</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
