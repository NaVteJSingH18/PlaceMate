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
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-950 p-5 text-white lg:block">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">PlaceMate</h1>
        <p className="mt-1 text-sm text-slate-400">Campus placement CRM</p>
      </div>

      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
