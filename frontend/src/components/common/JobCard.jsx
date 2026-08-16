import { useState } from "react";
import JobDetailsModal from "./JobDetailsModal";
import { formatDistanceToNow, isPast } from "date-fns";
import { FaEdit, FaTrash } from "react-icons/fa";

function JobCard({ job, canApply = false, onApply, canEdit = false, onEdit, onDelete }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const salary = job.baseSalary?.amount
    ? `INR ${job.baseSalary.amount.toLocaleString("en-IN")}`
    : "N/A";

  const deadline = job.validThrough
    ? new Date(job.validThrough).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No deadline";

  const isDeadlinePast = job.validThrough ? isPast(new Date(job.validThrough)) : false;

  const postedTime = job.datePosted || job.createdAt 
    ? formatDistanceToNow(new Date(job.datePosted || job.createdAt), { addSuffix: true }) 
    : "Recently";

  const jobType = job.employmentType === "FULL_TIME" 
    ? "Full-Time" 
    : job.employmentType === "INTERN" 
    ? "Internship" 
    : "Internship + Full-Time";

  return (
    <article className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Top Row: Logo, Titles, Badges */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          {job.logo?.url ? (
            <img
              alt={`${job.company?.name || "Company"} logo`}
              className="h-12 w-12 rounded border border-slate-200 object-contain p-1"
              src={job.logo.url}
            />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded border border-slate-200 bg-slate-50 text-lg font-bold text-slate-600">
              {(job.company?.name || "C").charAt(0)}
            </div>
          )}

          <div>
            <h3 className="text-[17px] font-bold text-slate-900">{job.title || "Untitled Role"}</h3>
            <p className="text-sm font-medium text-slate-600">{job.company?.name || "Unknown Company"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-medium text-slate-400">{postedTime}</span>
          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
            job.applicationStatus === "Selected" 
            ? "bg-emerald-50 text-emerald-600"
            : job.applicationStatus === "Rejected"
            ? "bg-red-50 text-red-600"
            : job.applicationStatus 
            ? "bg-blue-50 text-blue-600"
            : "bg-emerald-50 text-emerald-600"
          }`}>
            {job.applicationStatus || "Eligible"}
          </span>
        </div>
      </div>

      {/* Middle Row: Details */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-b border-slate-100 pb-6 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Job type</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{jobType}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">CTC</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{salary}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-500">Location</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{job.location || "Pan India"}</p>
        </div>
      </div>

      {/* Bottom Row: Deadline & Action */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-block rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
          {isDeadlinePast ? "Registrations closed on " : "Apply by "}{deadline}
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsDetailsOpen(true)}
            className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
            type="button"
          >
            View details &gt;
          </button>
          
          {canApply && !isDeadlinePast && (
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm hover:shadow"
              onClick={() => onApply?.(job)}
              type="button"
            >
              Apply Now
            </button>
          )}

          {canEdit && (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
              <button
                className="text-slate-400 hover:text-blue-600 transition p-1.5 rounded hover:bg-blue-50"
                onClick={() => onEdit?.(job)}
                title="Edit Job"
                type="button"
              >
                <FaEdit size={16} />
              </button>
              <button
                className="text-slate-400 hover:text-red-600 transition p-1.5 rounded hover:bg-red-50"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this job?")) {
                    onDelete?.(job._id);
                  }
                }}
                title="Delete Job"
                type="button"
              >
                <FaTrash size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <JobDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        job={job} 
      />
    </article>
  );
}

export default JobCard;
