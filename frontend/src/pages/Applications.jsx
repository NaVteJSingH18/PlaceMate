import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import Table from "../components/common/Table";
import { usePlacement } from "../context/placementStore";
import { useState } from "react";
import ApplicationAction from "../components/common/ApplicationAction";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const filters = ["All", "Applied", "Shortlisted", "Interview", "Selected"];

function Applications() {
  const { applications, refreshData } = usePlacement();
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = applications.filter((application) => {
    const matchesSearch = [
      application.student?.name || "",
      application.job?.company?.name || "",
      application.job?.title || "",
      application.status || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Candidate",
      key: "student",
      render: (application) => (
        <div>
          <p className="font-semibold text-slate-950">{application.student?.name || "Unknown"}</p>
          <p className="text-xs text-slate-500">{application.job?.title || "Unknown"}</p>
        </div>
      ),
    },
    { header: "Branch", key: "branch", render: (application) => application.student?.branch || "N/A" },
    { header: "CGPA", key: "cgpa", render: (application) => application.student?.cgpa ?? "N/A" },
    {
      header: "Resume",
      key: "resume",
      render: (application) =>
        application.student?.resume?.url ? (
          <a
            className="font-semibold text-blue-600 hover:underline"
            href={application.student.resume.url}
            rel="noreferrer"
            target="_blank"
          >
            View Resume
          </a>
        ) : (
          <span className="text-slate-500">Not uploaded</span>
        ),
    },
    { header: "Company", key: "company", render: (application) => application.job?.company?.name || "Unknown" },
    { header: "Applied on", key: "createdAt", render: (application) => new Date(application.createdAt || application.appliedOn || Date.now()).toLocaleDateString() },
    {
      header: "Action",
      key: "status",
      render: (application) => (
        <ApplicationAction 
          application={application} 
          onStatusChange={async (id, newStatus) => {
            try {
              await api.put(`/applications/${id}/status`, { status: newStatus });
              refreshData();
            } catch (error) {
              console.error("Failed to update status", error);
              alert("Failed to update status");
            }
          }}
        />
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Applications</h1>
            <p className="mt-2 text-sm text-slate-500">
              Follow every candidate from applied to final selection.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              onChange={setSearchTerm}
              placeholder="Search applications"
              value={searchTerm}
            />

            <select
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter === "All" ? "All Status" : filter}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-4">
          {filters.slice(1).map((filter) => {
            const count = applications.filter(
              (application) => application.status === filter
            ).length;

            return (
              <article
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={filter}
              >
                <StatusBadge status={filter} />
                <p className="mt-4 text-3xl font-bold text-slate-950">{count}</p>
                <p className="mt-1 text-sm text-slate-500">{filter} applications</p>
              </article>
            );
          })}
        </div>

        {role === "admin" ? (
          <Table
            columns={columns}
            data={filteredApplications}
            emptyMessage="No applications found for this drive yet"
          />
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-3">
            {filteredApplications.map((application) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                key={application._id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {application.job?.title || "Unknown role"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {application.job?.company?.name || "Unknown company"}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">No applications yet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start applying from the Companies page to track your lifecycle here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Applications;
