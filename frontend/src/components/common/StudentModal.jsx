import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function StudentModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
    skills: ""
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "", // Email might not be available if not populated
        password: "", // Leave blank for edit
        branch: initialData.branch || "",
        cgpa: initialData.cgpa || "",
        skills: (initialData.skills || []).join(", ")
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        branch: "",
        cgpa: "",
        skills: ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      cgpa: Number(formData.cgpa),
      skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative z-10 inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-[0_8px_30px_rgba(28,44,92,0.12)] transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {initialData ? "Edit Student" : "Add New Student"}
                </h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                {!initialData && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                  <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CGPA</label>
                  <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
            </div>
            <div className="bg-white px-6 py-6 sm:px-8 sm:flex sm:flex-row-reverse">
              <button type="submit" className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2.5 bg-[#1c2c5c] text-sm font-bold text-white hover:bg-blue-900 sm:ml-3 sm:w-auto transition-colors">
                {initialData ? "Save Changes" : "Add Student"}
              </button>
              <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-full bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 sm:mt-0 sm:ml-3 sm:w-auto transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
