import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import Table from "../components/common/Table";
import { usePlacement } from "../context/placementStore";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Students() {
  const { students } = usePlacement();
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  if (role !== "admin") {
    return (
      <Layout>
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Admin only view</h1>
          <p className="mt-1 text-sm text-slate-500">
            Student roster is visible only to placement coordinators.
          </p>
        </div>
      </Layout>
    );
  }

  const filteredStudents = students.filter((student) =>
    [student.name, student.branch, ...(student.skills || [])]
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
          {(student.skills || []).map((skill) => (
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
    {
      header: "Resume",
      key: "resume",
      render: (student) => (
        <span className="text-sm font-medium text-slate-700">
          {student.resume?.url ? "Uploaded" : "Pending"}
        </span>
      ),
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
                  {student.name ? student.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .substring(0, 2) : "S"}
                </div>
                {student.resume?.url ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-md">Resume Uploaded</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">No Resume</span>
                )}
              </div>

              <h2 className="mt-4 font-bold text-slate-950">{student.name || "Unknown"}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {student.branch || "No Branch"} - CGPA {student.cgpa || "N/A"}
              </p>
            </article>
          ))}
        </div>

        {students.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">No students registered yet</h2>
            <p className="mt-1 text-sm text-slate-500">Students will appear here after signup.</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredStudents}
            emptyMessage="No students match your search"
          />
        )}
      </div>
    </Layout>
  );
}

export default Students;
