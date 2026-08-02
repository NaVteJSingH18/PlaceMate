import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import Table from "../components/common/Table";
import { usePlacement } from "../context/placementStore";
import { useState } from "react";
import ApplicationAction from "../components/common/ApplicationAction";

const filters = ["All", "Applied", "Shortlisted", "Interview", "Selected"];

function Applications() {
  const { applications } = usePlacement();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = applications.filter((application) => {
    const matchesSearch = [
      application.student,
      application.company,
      application.role,
      application.status,
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
          <p className="font-semibold text-slate-950">{application.student}</p>
          <p className="text-xs text-slate-500">{application.role}</p>
        </div>
      ),
    },
    { header: "Company", key: "company" },
    { header: "Applied on", key: "appliedOn" },
    { header: "Next step", key: "nextStep" },
    {
      header: "Status",
      key: "status",
      render: (application) => (
        <ApplicationAction 
          application={application} 
          onStatusChange={(id, newStatus) => {
            console.log("Status changed:", id, newStatus);
            // Will update in Phase 4 API integration
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

            <div className="flex overflow-x-auto rounded-lg border border-slate-200 bg-white p-1">
              {filters.map((filter) => (
                <button
                  className={`h-9 rounded-md px-3 text-sm font-semibold transition ${
                    statusFilter === filter
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
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

        <Table
          columns={columns}
          data={filteredApplications}
          emptyMessage="No applications match these filters"
        />
      </div>
    </Layout>
  );
}

export default Applications;
