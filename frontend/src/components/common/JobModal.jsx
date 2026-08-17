import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function JobModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    category: "",
    employmentType: "FULL_TIME",
    baseSalaryAmount: "",
    location: "Pan India",
    validThrough: "",
    description: "",
    logo: null
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        companyName: initialData.company?.name || "",
        category: initialData.category || "",
        employmentType: initialData.employmentType || "FULL_TIME",
        baseSalaryAmount: initialData.baseSalary?.amount || "",
        location: initialData.location || "Pan India",
        validThrough: initialData.validThrough ? new Date(initialData.validThrough).toISOString().split('T')[0] : "",
        description: initialData.description || "",
        logo: null
      });
    } else if (isOpen) {
      setFormData({
        title: "",
        companyName: "",
        category: "",
        employmentType: "FULL_TIME",
        baseSalaryAmount: "",
        location: "Pan India",
        validThrough: "",
        description: "",
        logo: null
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      title: "",
      companyName: "",
      category: "",
      employmentType: "FULL_TIME",
      baseSalaryAmount: "",
      location: "Pan India",
      validThrough: "",
      description: "",
      logo: null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative z-10 inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-[0_8px_30px_rgba(28,44,92,0.12)] transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900" id="modal-headline">
                  {initialData ? "Edit Job Drive" : "Post New Job Drive"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <FiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                    Job Title
                  </label>
                  <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input type="text" name="companyName" id="companyName" required value={formData.companyName} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                    Category (e.g. Engineering)
                  </label>
                  <input type="text" name="category" id="category" required value={formData.category} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <select name="employmentType" id="employmentType" required value={formData.employmentType} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERN">Intern</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="baseSalaryAmount" className="block text-sm font-medium text-slate-700 mb-1">
                    Salary / Package
                  </label>
                  <input type="number" name="baseSalaryAmount" id="baseSalaryAmount" value={formData.baseSalaryAmount} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label htmlFor="validThrough" className="block text-sm font-medium text-slate-700 mb-1">
                    Application Deadline
                  </label>
                  <input type="date" name="validThrough" id="validThrough" required value={formData.validThrough} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-slate-700 mb-1">
                    Company Logo
                  </label>
                  <input type="file" name="logo" id="logo" accept="image/*" onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                    Job Description
                  </label>
                  <textarea name="description" id="description" required rows="3" value={formData.description} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
            </div>
            <div className="bg-white px-6 py-6 sm:px-8 sm:flex sm:flex-row-reverse">
              <button
                className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2.5 bg-[#1c2c5c] text-sm font-bold text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto transition-colors"
              >
                {initialData ? "Save Changes" : "Post Job"}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-full bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
