const styles = {
  Applied: "bg-sky-50 text-sky-700 ring-sky-200",
  Interview: "bg-amber-50 text-amber-700 ring-amber-200",
  Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Screening: "bg-violet-50 text-violet-700 ring-violet-200",
  Selected: "bg-green-50 text-green-700 ring-green-200",
  Shortlisted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "Under Review": "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[status] || "bg-slate-50 text-slate-700 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
