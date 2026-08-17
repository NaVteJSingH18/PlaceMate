import { useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import StatusBadge from "../components/common/StatusBadge";
import ApplicationAction from "../components/common/ApplicationAction";
import api from "../services/api";
import { usePlacement } from "../context/placementStore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import JobDetailsModal from "../components/common/JobDetailsModal";

function Dashboard() {
  const { user } = useAuth();
  const { applications, companies, stats, refreshData } = usePlacement();
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [appStatusFilter, setAppStatusFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredCompanies = companies.filter(company =>
    jobTypeFilter === "All" || company.employmentType === jobTypeFilter
  );

  const filteredApps = applications.filter(app =>
    appStatusFilter === "All" || app.status === appStatusFilter
  );

  const applicationStats = [
    { name: 'Applied', value: applications.filter(a => a.status === 'Applied').length, fill: '#3b82f6' }, // blue-500
    { name: 'Interview', value: applications.filter(a => a.status === 'Interview').length, fill: '#8b5cf6' }, // violet-500
    { name: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length, fill: '#f59e0b' }, // amber-500
    { name: 'Selected', value: applications.filter(a => a.status === 'Selected').length, fill: '#10b981' }, // emerald-500
    { name: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, fill: '#ef4444' } // red-500
  ].filter(stat => stat.value > 0);

  const chartData = applicationStats.length > 0 ? applicationStats : [
    { name: 'No Applications Yet', value: 1, fill: '#e2e8f0' } // slate-200
  ];

  const handleExport = async () => {
    try {
      const response = await api.get("/reports/export", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      // Try to extract filename from content-disposition header if possible, otherwise fallback
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `placement_report_${new Date().toISOString().split('T')[0]}.csv`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export report", error);
      alert("Failed to export report");
    }
  };

  return (
    <Layout>
      <div className="font-sans">
        <div className="space-y-8">
          {/* Hero / Welcome banner */}
          <section className="relative overflow-hidden rounded-3xl bg-[#1c2c5c] px-8 py-10 text-white shadow-[0_8px_30px_rgba(28,44,92,0.12)]">
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between h-full">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-100 ring-1 ring-inset ring-white/10 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  {companies.length > 0 ? "Active Season" : "Off Season"}
                </span>

                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mt-2">
                  Welcome back, {user?.name ? user.name.split(" ")[0] : "User"}!
                </h1>
                <p className="mt-4 text-base leading-relaxed text-blue-200 max-w-md">
                  {user?.role === "admin"
                    ? "Track students, company drives, and application movement from one focused workspace."
                    : "Always stay updated in your student panel."}
                </p>
                
                {user?.role === "admin" && (
                  <button
                    onClick={handleExport}
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#1c2c5c] shadow-lg shadow-black/10 transition-transform active:scale-95"
                    type="button"
                  >
                    Export Report
                  </button>
                )}
              </div>
            </div>
            
            {/* 3D Illustration */}
            <div 
              className="absolute -bottom-8 -right-8 h-[130%] opacity-20 md:opacity-100 pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)'
              }}
            >
              <img src="/banner-student.jpg" alt="Student 3D Illustration" className="h-full w-full object-contain" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c2c5c] via-[#1c2c5c]/60 to-transparent pointer-events-none" />
          </section>

          {/* Resume prompt (students) */}
          {user?.role === "student" && (
            <section className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Resume</h2>
                <p className="mt-1 text-sm text-slate-500">Make sure your resume is up to date before applying to opportunities.</p>
              </div>
              <Link to="/profile" className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition hover:bg-blue-700">
                Upload / Update Resume
              </Link>
            </section>
          )}

          {/* Finance-style stats row */}
          <section>
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-slate-900">Overview</h2>
            </div>
            <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${user?.role === "admin" ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
              {user?.role === "admin" && (
                <StatsCard icon={FaUsers} label="Students" tone="blue" value={stats.students} />
              )}
              <StatsCard
                icon={FaBuilding}
                label="Companies"
                tone="green"
                value={stats.companies}
              />
              <StatsCard
                icon={FaClipboardList}
                label="Applications"
                tone="orange"
                value={stats.applications}
              />
              <StatsCard
                icon={FaCheckCircle}
                label="Selected"
                tone="slate"
                value={stats.selected}
              />
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            {/* Upcoming drives — "Enrolled Courses" style */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Upcoming drives</h2>
                  <span className="text-sm font-medium text-slate-400">
                    {filteredCompanies.length} active
                  </span>
                </div>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="INTERN">Intern</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCompanies.length > 0 ? filteredCompanies.slice(0, 4).map((company) => (
                  <article
                    className="group flex flex-col justify-between gap-4 rounded-3xl bg-[#e8ebf4] p-5 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1c2c5c]/10"
                    key={company._id || company.id}
                  >
                    <div>
                      <h3 className="font-bold text-[#1c2c5c] text-base line-clamp-2 leading-tight mb-2">
                        {company.title} <br/> at {company.company?.name || "Unknown"}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {company.baseSalary?.amount ? `${company.baseSalary.amount}` : "N/A"} - {company.location || "Pan India"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedJob(company)}
                        className="rounded-full bg-[#1c2c5c] px-6 py-2 text-xs font-bold text-white transition hover:bg-blue-800 shadow-sm"
                        type="button"
                      >
                        View
                      </button>
                      <StatusBadge status={company.status} />
                    </div>
                  </article>
                )) : (
                  <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center text-sm font-medium text-slate-400">
                    No upcoming drives scheduled.
                  </div>
                )}
              </div>
            </section>

            {/* Analytics */}
            <section className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Application Analytics</h2>
              <div className="flex min-h-[300px] w-full flex-1 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Latest applications — "Daily notice" style */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-lg font-bold text-slate-900">
                Latest applications
              </h2>
              <select
                className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="custom-scrollbar flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredApps.length > 0 ? filteredApps.slice(0, 10).map((application) => (
                <article
                  className="group relative rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-blue-200 hover:shadow-md"
                  key={application._id || application.id}
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-600">
                      {(user?.role === "admin"
                        ? application.student?.name || "U"
                        : application.job?.title || "R").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 line-clamp-1">
                        {user?.role === "admin"
                          ? application.student?.name || "Unknown Student"
                          : application.job?.title || "Unknown Role"}
                      </h3>
                      <p className="mt-0.5 text-[13px] font-medium text-slate-400 line-clamp-2">
                        {user?.role === "admin"
                          ? `${application.job?.title || "Role"} at ${application.job?.company?.name || "Company"}`
                          : application.job?.company?.name || "Unknown Company"}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <Link to={`/applications`} className="text-xs font-bold text-blue-600 hover:text-blue-700">See more</Link>
                        {user?.role === "admin" ? (
                          <ApplicationAction
                            application={application}
                            onStatusChange={async (id, newStatus) => {
                              try {
                                await api.put(`/applications/${id}/status`, { status: newStatus });
                                if (refreshData) refreshData();
                              } catch (error) {
                                console.error("Failed to update status", error);
                              }
                            }}
                          />
                        ) : (
                          <StatusBadge status={application.status} />
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center text-sm font-medium text-slate-400">
                  No applications received yet.
                </div>
              )}
            </div>
          </section>
        </div>
        
        {selectedJob && (
          <JobDetailsModal
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            job={selectedJob}
          />
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
