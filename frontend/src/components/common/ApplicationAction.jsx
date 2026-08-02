import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "./StatusBadge";

export default function ApplicationAction({ application, onStatusChange }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(application.status);

  const statuses = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(application.id, newStatus);
    }
  };

  if (user?.role === "Admin") {
    return (
      <select
        value={status}
        onChange={handleChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  }

  return <StatusBadge status={status} />;
}
