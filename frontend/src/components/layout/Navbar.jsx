import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { usePlacement } from "../../context/placementStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const { companies, applications } = usePlacement();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const notifications = user?.role === "admin"
    ? applications.slice(0, 5).map((app, index) => ({
        id: app._id || index,
        text: `New application received from ${app.student?.name || "a student"} for ${app.job?.title || "a role"}.`,
        time: app.createdAt ? new Date(app.createdAt).toLocaleString() : "Recently applied",
        isUnread: true,
      }))
    : companies.slice(0, 5).map((job, index) => ({
        id: job._id || index,
        text: `New Opportunity: ${job.company?.name || "Company"} - ${job.title}.`,
        time: job.createdAt ? new Date(job.createdAt).toLocaleString() : "Recently added",
        isUnread: true,
      }));

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-transparent px-4 py-6 sm:px-6 lg:px-8">
      <div className="hidden flex-1 sm:block">
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="h-12 w-full rounded-full bg-white pl-11 pr-4 text-sm font-medium text-slate-700 shadow-[0_2px_12px_rgba(0,0,0,0.03)] outline-none transition focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-5">

        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsDropdownOpen(false);
            }}
            className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-slate-400 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:text-slate-600"
            type="button"
          >
            <FaBell className="text-lg" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-[450px] max-w-[90vw] bg-white border border-slate-200 rounded-lg shadow-xl z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Notifications <span className="text-blue-600 font-medium">({notifications.length})</span></h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition flex gap-3">
                    <div className="pt-1.5">
                      <div className={`h-2 w-2 rounded-full ${notif.isUnread ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 leading-snug">{notif.text}</p>
                      <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-sm text-slate-500 text-center">No new notifications</div>
                )}
              </div>
              <div className="p-3 text-center border-t border-slate-100">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 rounded-full bg-white pl-2 pr-4 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name || "User Name"}</p>
              <p className="text-[11px] font-semibold text-slate-400">{user?.role === "admin" ? "Administrator" : "Student"}</p>
            </div>
            <FaChevronDown className="ml-1 text-[10px] text-slate-400" />
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
