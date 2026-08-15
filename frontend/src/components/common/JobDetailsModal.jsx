import { FiX } from "react-icons/fi";

export default function JobDetailsModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null;

  const salary = job.baseSalary?.amount
    ? `INR ${job.baseSalary.amount.toLocaleString("en-IN")}`
    : "Not Disclosed";

  const deadline = job.validThrough
    ? new Date(job.validThrough).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No deadline";

  const jobType = job.employmentType === "FULL_TIME" 
    ? "Full-Time" 
    : job.employmentType === "INTERN" 
    ? "Internship" 
    : job.employmentType === "PART_TIME"
    ? "Part-Time"
    : "Contract";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative z-10 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-200">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                {job.logo?.url ? (
                  <img src={job.logo.url} alt="Logo" className="h-16 w-16 rounded-md border border-slate-200 object-contain p-2" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-md border border-slate-200 bg-slate-50 text-2xl font-bold text-slate-600">
                    {(job.company?.name || "C").charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{job.title || "Untitled Role"}</h3>
                  <p className="text-base font-medium text-slate-600">{job.company?.name || "Unknown Company"}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-5 mb-5 sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Job Type</p>
                <p className="text-sm font-medium text-slate-800">{jobType}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Salary</p>
                <p className="text-sm font-medium text-slate-800">{salary}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm font-medium text-slate-800">{job.location || "Pan India"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deadline</p>
                <p className="text-sm font-medium text-slate-800">{deadline}</p>
              </div>
              {job.category && (
                <div className="col-span-2 sm:col-span-4 mt-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-medium text-slate-800">{job.category}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Job Description</h4>
              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-lg p-4 border border-slate-100">
                {job.description || "No description provided."}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
