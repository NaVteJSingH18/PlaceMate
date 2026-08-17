import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import { useEffect, useMemo, useState } from "react";
import JobModal from "../components/common/JobModal";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import JobCard from "../components/common/JobCard";
import JobStatsSidebar from "../components/companies/JobStatsSidebar";
import { usePlacement } from "../context/placementStore";

function Companies() {
  const { user } = useAuth();
  const { applications, refreshData } = usePlacement();
  const [activeTab, setActiveTab] = useState("Opportunities");
  const [showEligible, setShowEligible] = useState(true);
  const [showNonEligible, setShowNonEligible] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  const [jobStatus, setJobStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadJobs = async () => {
    if (!loading) setLoading(true);
    try {
      const response = await api.get(`/jobs?page=${currentPage}&limit=10`);
      setJobs(response.data?.jobs || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [currentPage]);

  useEffect(() => {
    if (user?.role === "student" && user.studentId) {
      api.get(`/students/${user.studentId}`)
        .then(res => setStudentProfile(res.data))
        .catch(err => console.error("Failed to load student profile", err));
    }
  }, [user]);

  const checkEligibility = (job, student) => {
    if (!student) return true;
    const studentCgpa = student.cgpa || 0;
    const cutoff = job.eligibilityCriteria?.cgpaCutoff || 0;
    return studentCgpa >= cutoff;
  };

  const displayedJobs = useMemo(() => {
    let sourceList = [];
    
    if (activeTab === "Opportunities") {
      const appliedJobIds = applications.map(app => 
        typeof app.job === 'object' ? app.job?._id : app.job
      );
      sourceList = jobs.filter(job => {
        if (user?.role === "student" && appliedJobIds.includes(job._id)) {
          return false;
        }
        return true;
      });
    } else if (activeTab === "Applications") {
      sourceList = applications.map(app => ({
        ...(app.job || {}),
        applicationStatus: app.status
      }));
    } else if (activeTab === "Offers") {
      sourceList = applications
        .filter(app => app.status === "Selected")
        .map(app => ({
          ...(app.job || {}),
          applicationStatus: app.status
        }));
    }

    return sourceList.filter((job) => {
      if (!job || !job._id) return false;
      const matchesSearch = [job.company?.name || "", job.title || "", job.location || ""]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesType = employmentType === "All" || job.employmentType === employmentType;
      const matchesStatus = jobStatus === "All" || job.status === jobStatus;

      let isEligibleJob = true;
      if (user?.role === "student") {
        isEligibleJob = checkEligibility(job, studentProfile);
      }

      const matchesEligible = showEligible && isEligibleJob;
      const matchesNonEligible = showNonEligible && !isEligibleJob;
      
      const passesEligibilityFilter = user?.role !== "student" || matchesEligible || matchesNonEligible;

      return matchesSearch && matchesType && matchesStatus && passesEligibilityFilter;
    }).map(job => {
      if (user?.role === "student") {
         return { ...job, isEligible: checkEligibility(job, studentProfile) };
      }
      return job;
    });
  }, [jobs, applications, searchTerm, activeTab, user, employmentType, jobStatus, showEligible, showNonEligible, studentProfile]);

  const handleApply = async (job) => {
    try {
      await api.post("/applications", { job: job._id });
      window.alert("Applied successfully");
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
      refreshData();
    } catch (error) {
      window.alert(error.response?.data?.message || "Failed to apply");
    }
  };

  const handleCreateJob = async (data) => {
    const payload = {
      title: data.title,
      company: {
        name: data.companyName
      },
      category: data.category,
      employmentType: data.employmentType,
      baseSalary: {
        amount: data.baseSalaryAmount ? Number(data.baseSalaryAmount) : 0
      },
      location: data.location,
      validThrough: data.validThrough,
      description: data.description
    };

    const response = await api.post("/jobs", payload);

    if (data.logo) {
      const formData = new FormData();
      formData.append("logo", data.logo);
      await api.post(`/jobs/${response.data._id}/logo`, formData);
    }

    await loadJobs();
  };

  const handleUpdateJob = async (data) => {
    const payload = {
      title: data.title,
      company: {
        name: data.companyName
      },
      category: data.category,
      employmentType: data.employmentType,
      baseSalary: {
        amount: data.baseSalaryAmount ? Number(data.baseSalaryAmount) : 0
      },
      location: data.location,
      validThrough: data.validThrough,
      description: data.description
    };

    await api.put(`/jobs/${editingJob._id}`, payload);

    if (data.logo) {
      const formData = new FormData();
      formData.append("logo", data.logo);
      await api.post(`/jobs/${editingJob._id}/logo`, formData);
    }

    await loadJobs();
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      window.alert("Job deleted successfully");
      await loadJobs();
    } catch (error) {
      window.alert(error.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-800">
            <span className="text-3xl text-blue-600">💼</span>
            <h1 className="text-3xl font-medium tracking-tight">Jobs</h1>
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => {
                setEditingJob(null);
                setIsModalOpen(true);
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Add Job
            </button>
          )}
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[1fr_350px]">
          
          {/* Left Column: Jobs List */}
          <section>
            {/* Tabs & Filters */}
            <div className="mb-6 border-b border-slate-200">
              <nav className="flex items-center gap-8 text-sm font-medium">
                <button
                  className={`py-3 ${activeTab === "Opportunities" ? "border-b-2 border-blue-600 text-blue-600 font-bold" : "text-slate-500 hover:text-slate-700"}`}
                  onClick={() => setActiveTab("Opportunities")}
                >
                  Opportunities
                </button>
                <button
                  className={`py-3 ${activeTab === "Applications" ? "border-b-2 border-blue-600 text-blue-600 font-bold" : "text-slate-500 hover:text-slate-700"}`}
                  onClick={() => setActiveTab("Applications")}
                >
                  Applications
                </button>
                <button
                  className={`py-3 ${activeTab === "Offers" ? "border-b-2 border-blue-600 text-blue-600 font-bold" : "text-slate-500 hover:text-slate-700"}`}
                  onClick={() => setActiveTab("Offers")}
                >
                  Offers
                </button>
              </nav>
            </div>

            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex w-full flex-col gap-4 sm:max-w-2xl sm:flex-row sm:items-center">
                <div className="flex-1">
                  <SearchBar
                    onChange={setSearchTerm}
                    placeholder="Search roles or locations"
                    value={searchTerm}
                  />
                </div>
                <select
                  className="h-11 w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
                  onChange={(event) => setEmploymentType(event.target.value)}
                  value={employmentType}
                >
                  <option value="All">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="INTERN">Intern</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
                <select
                  className="h-11 w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
                  onChange={(event) => setJobStatus(event.target.value)}
                  value={jobStatus}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              {user?.role === "student" && (
                <div className="flex shrink-0 justify-start gap-6 text-sm font-medium text-slate-600 xl:justify-end">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      checked={showEligible}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => setShowEligible(e.target.checked)}
                      type="checkbox"
                    />
                    Eligible
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      checked={showNonEligible}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => setShowNonEligible(e.target.checked)}
                      type="checkbox"
                    />
                    Non Eligible
                  </label>
                </div>
              )}
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                Loading...
              </div>
            ) : displayedJobs.length > 0 ? (
              <div className="flex flex-col">
                {displayedJobs.map((job) => (
                  <JobCard
                    canApply={user?.role === "student" && activeTab === "Opportunities"}
                    canEdit={user?.role === "admin"}
                    job={job}
                    key={job._id}
                    onApply={handleApply}
                    onEdit={(job) => {
                      setEditingJob(job);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteJob}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">No active jobs right now</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Check back after admins publish new drives.
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>

          {/* Right Column: Stats Sidebar */}
          <JobStatsSidebar
            jobs={jobs}
            applications={applications}
          />
        </div>

        <JobModal
          isOpen={isModalOpen}
          initialData={editingJob}
          onClose={() => {
            setIsModalOpen(false);
            setEditingJob(null);
          }}
          onSubmit={async (data) => {
            try {
              if (editingJob) {
                await handleUpdateJob(data);
              } else {
                await handleCreateJob(data);
              }
              setIsModalOpen(false);
              setEditingJob(null);
            } catch (error) {
              console.error("Error saving job:", error);
              window.alert(error.response?.data?.message || "Failed to save job");
            }
          }}
        />
      </div>
    </Layout>
  );
}

export default Companies;
