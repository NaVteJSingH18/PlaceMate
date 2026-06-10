import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import Table from "../components/common/Table";
import { usePlacement } from "../context/placementStore";
import { useState } from "react";

function Students() {
  const { students } = usePlacement();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) =>
    [student.name, student.branch, student.status, ...student.skills]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Student",
      key: "name",
      render: (student) => (
        <div>
          <p className="font-semibold text-slate-950">{student.name}</p>
          <p className="text-xs text-slate-500">{student.branch}</p>
        </div>
      ),
    },
    { header: "CGPA", key: "cgpa" },
    {
      header: "Skills",
      key: "skills",
      render: (student) => (
        <div className="flex max-w-md flex-wrap gap-2">
          {student.skills.map((skill) => (
            <span
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
              key={skill}
            >
              {skill}
            </span>
          ))}
        </div>
      ),
    },
    { header: "Applications", key: "applications" },
    {
      header: "Status",
      key: "status",
      render: (student) => <StatusBadge status={student.status} />,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Students</h1>
            <p className="mt-2 text-sm text-slate-500">
              Review eligible candidates, application counts, and interview status.
            </p>
          </div>

          <SearchBar
            onChange={setSearchTerm}
            placeholder="Search students"
            value={searchTerm}
          />
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {students.map((student) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={student.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 font-bold text-blue-700">
                  {student.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <StatusBadge status={student.status} />
              </div>

              <h2 className="mt-4 font-bold text-slate-950">{student.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {student.branch} - CGPA {student.cgpa}
              </p>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                {student.applications} applications submitted
              </p>
            </article>
          ))}
        </div>

        <Table
          columns={columns}
          data={filteredStudents}
          emptyMessage="No students match your search"
        />
      </div>
    </Layout>
  );
}

export default Students;
