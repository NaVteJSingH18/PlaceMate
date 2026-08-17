import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "./StatusBadge";

export default function ApplicationAction({ application, onStatusChange }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(application.status);

  useEffect(() => {
    setStatus(application.status);
  }, [application.status]);

  const statuses = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(application._id || application.id, newStatus);
    }
  };

  if (user?.role === "admin") {
    return (
      <select
        value={status}
        onChange={handleChange}
        className="block w-full py-1.5 pl-3 pr-8 text-xs font-bold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg bg-slate-50 text-slate-700 cursor-pointer appearance-none shadow-sm transition-colors hover:bg-white"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.25rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        {statuses.map((s) => (
          <option key={s} value={s} className="font-medium text-slate-700 bg-white">
            {s}
          </option>
        ))}
      </select>
    );
  }

  return <StatusBadge status={status} />;
}
