import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import Table from "../components/common/Table";
import { usePlacement } from "../context/placementStore";
import { useState } from "react";
import JobModal from "../components/common/JobModal";
import { useAuth } from "../context/AuthContext";

function Companies() {
  const { companies } = usePlacement();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const filteredCompanies = companies.filter((company) =>
    [company.name, company.role, company.location]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Company",
      key: "name",
      render: (company) => (
        <div>
          <p className="font-semibold text-slate-950">{company.name}</p>
          <p className="text-xs text-slate-500">{company.location}</p>
        </div>
      ),
    },
    { header: "Role", key: "role" },
    { header: "Package", key: "package" },
    { header: "Openings", key: "openings" },
    { header: "Deadline", key: "deadline" },
    {
      header: "Status",
      key: "status",
      render: (company) => <StatusBadge status={company.status} />,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Companies</h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage hiring partners, open roles, deadlines, and drive status.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar
              onChange={setSearchTerm}
              placeholder="Search companies"
              value={searchTerm}
            />
            {user?.role === "Admin" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shrink-0"
              >
                Add Job
              </button>
            )}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {companies.map((company) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={company.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-950">{company.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{company.role}</p>
                </div>
                <StatusBadge status={company.status} />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">
                  {company.package}
                </span>
                <span className="text-slate-500">{company.openings} openings</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {company.skills.map((skill) => (
                  <span
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {user?.role === "Student" && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                    Apply Now
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        <Table
          columns={columns}
          data={filteredCompanies}
          emptyMessage="No companies match your search"
        />

        <JobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => {
            console.log("New Job:", data);
            // Will integrate with backend in Phase 4
          }}
        />
      </div>
    </Layout>
  );
}

export default Companies;
