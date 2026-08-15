import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";
import { FaBuilding, FaFileAlt, FaHome, FaUsers } from "react-icons/fa";

const mobileLinks = [
  { icon: <FaHome />, name: "Dashboard", path: "/dashboard" },
  { icon: <FaBuilding />, name: "Companies", path: "/companies" },
  { icon: <FaUsers />, name: "Students", path: "/students" },
  { icon: <FaFileAlt />, name: "Applications", path: "/applications" },
];

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <Navbar />

        <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white lg:hidden">
        {mobileLinks.map((link) => (
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-3 text-xs font-semibold ${
                isActive ? "text-blue-700" : "text-slate-500"
              }`
            }
            key={link.name}
            to={link.path}
          >
            <span className="text-base">{link.icon}</span>
            <span className="truncate">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Layout;
