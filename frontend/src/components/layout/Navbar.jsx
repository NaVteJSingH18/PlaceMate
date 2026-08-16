import { FaBell, FaUserCircle, FaQuestionCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { usePlacement } from "../../context/placementStore";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const { companies, applications } = usePlacement();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("companies")) return "Companies";
    if (path.includes("students")) return "Students";
    if (path.includes("applications")) return "Applications";
    if (path.includes("profile")) return "My Profile";
    return "Dashboard";
  };

  const notifications = user?.role === "admin"
    ? applications.slice(0, 5).map((app, index) => ({
        id: app._id || index,
        text: `New application received from ${app.student?.name || "a student"} for ${app.job?.title || "a role"} at ${app.job?.company?.name || "a company"}.`,
        time: app.createdAt ? new Date(app.createdAt).toLocaleString() : "Recently applied",
        isUnread: true,
      }))
    : companies.slice(0, 5).map((job, index) => ({
        id: job._id || index,
        text: `New Opportunity for You - ${job.company?.name || "Company"} - ${job.title} - ${job.location || "Location"}. Registrations Open till ${job.validThrough ? new Date(job.validThrough).toLocaleDateString() : 'TBD'}.`,
        time: job.createdAt ? new Date(job.createdAt).toLocaleString() : "Recently added",
        isUnread: true,
      }));

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {user?.role === "admin" ? "Placement Administration" : "Student Portal"}
        </p>
        <h2 className="text-lg font-bold text-slate-950">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Help & Support"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          type="button"
          onClick={() => window.alert("Help & Support center coming soon!")}
        >
          <FaQuestionCircle />
        </button>

        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsDropdownOpen(false);
            }}
            className="grid h-10 w-10 relative place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            type="button"
          >
            <FaBell />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500"></span>
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
                      <div className={`h-2 w-2 rounded-full ${notif.isUnread ? 'bg-purple-600' : 'bg-transparent'}`}></div>
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
