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

function Dashboard() {
  const { user } = useAuth();
  const { applications, companies, stats, refreshData } = usePlacement();
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [appStatusFilter, setAppStatusFilter] = useState("All");

  const filteredCompanies = companies.filter(company => 
    jobTypeFilter === "All" || company.employmentType === jobTypeFilter
  );

  const filteredApps = applications.filter(app =>
    appStatusFilter === "All" || app.status === appStatusFilter
  );

  const applicationStats = [
    { name: 'Applied', value: applications.filter(a => a.status === 'Applied').length, fill: '#3b82f6' }, // blue-500
    { name: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, fill: '#8b5cf6' }, // violet-500
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
      <div className="space-y-6">
        <section className="relative overflow-hidden flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 p-8 text-white shadow-xl sm:flex-row sm:items-end border border-white/10">
          {/* Abstract glowing orbs */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 -mb-10 h-40 w-40 rounded-full bg-purple-500 opacity-30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white shadow-sm backdrop-blur-md border border-white/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-sm">Hello, {user?.name || "User"}! 👋</h2>
              </div>
            </div>
            
            <span className="inline-block rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-bold tracking-widest uppercase text-blue-200 border border-white/10 shadow-sm">
              {companies.length > 0 ? "Active Season" : "Off Season"}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight drop-shadow-md">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-base text-blue-100/90 leading-relaxed font-medium">
              {user?.role === "admin"
                ? "Track students, company drives, and application movement from one focused workspace."
                : "Track your applications, discover upcoming company drives, and manage your placement profile from one focused workspace."}
            </p>
          </div>

          {user?.role === "admin" && (
            <button
              onClick={handleExport}
              className="relative z-10 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 flex items-center gap-2"
              type="button"
            >
              Export Report
            </button>
          )}
        </section>

        {user?.role === "student" && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-blue-900">Your Resume</h2>
              <p className="mt-1 text-sm text-blue-700">Make sure your resume is up to date before applying to opportunities.</p>
            </div>
            <Link to="/profile" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
              Upload / Update Resume
            </Link>
          </section>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard icon={FaUsers} label="Students" tone="blue" value={stats.students} />
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
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Upcoming drives</h2>
                <span className="text-sm font-medium text-slate-500">
                  {filteredCompanies.length} active
                </span>
              </div>
              <select
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCompanies.length > 0 ? filteredCompanies.map((company) => (
                <article
                  className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center"
                  key={company._id || company.id}
                >
                  <div>
                    <h3 className="font-semibold text-slate-950">{company.company?.name || "Unknown"}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {company.title} - {company.baseSalary?.amount ? `${company.baseSalary.amount}` : "N/A"} - {company.location || "Pan India"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={company.status} />
                    <span className="text-sm font-semibold text-slate-600">
                      {company.validThrough ? new Date(company.validThrough).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </article>
              )) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No upcoming drives scheduled.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
            <h2 className="mb-4 text-lg font-bold text-slate-950">Application Analytics</h2>
            <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
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

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-950">
              Latest applications
            </h2>
            <select
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredApps.length > 0 ? filteredApps.map((application) => (
              <article
                className="rounded-lg border border-slate-200 p-4 relative"
                key={application._id || application.id}
              >
                <div className="absolute top-4 right-4">
                  {user?.role === "admin" ? (
                    <ApplicationAction
                      application={application}
                      onStatusChange={async (id, newStatus) => {
                        try {
                          await api.put(`/applications/${id}/status`, { status: newStatus });
                          if (refreshData) refreshData();
                        } catch (error) {
                          console.error("Failed to update status", error);
                          alert("Failed to update status");
                        }
                      }}
                    />
                  ) : (
                    <StatusBadge status={application.status} />
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-slate-950">
                  {application.student?.name || "Unknown"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {application.job?.company?.name || "Unknown"}
                </p>
              </article>
            )) : (
              <div className="col-span-full rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No applications received yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Dashboard;
