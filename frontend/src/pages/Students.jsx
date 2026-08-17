import Layout from "../components/layout/Layout";
import SearchBar from "../components/common/SearchBar";
import Table from "../components/common/Table";
import { usePlacement } from "../context/placementStore";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StudentModal from "../components/common/StudentModal";
import api from "../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";

function Students() {
  const { students, refreshData } = usePlacement();
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleAddStudent = async (data) => {
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "student",
        branch: data.branch,
        cgpa: data.cgpa,
        skills: data.skills
      });
      window.alert("Student added successfully");
      refreshData();
    } catch (error) {
      window.alert(error.response?.data?.message || "Failed to add student");
    }
  };

  const handleEditStudent = async (data) => {
    try {
      await api.put(`/students/${editingStudent._id || editingStudent.id}`, {
        name: data.name,
        branch: data.branch,
        cgpa: data.cgpa,
        skills: data.skills
      });
      window.alert("Student updated successfully");
      refreshData();
    } catch (error) {
      window.alert(error.response?.data?.message || "Failed to update student");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student and their account?")) {
      try {
        await api.delete(`/students/${studentId}`);
        window.alert("Student deleted successfully");
        refreshData();
      } catch (error) {
        window.alert(error.response?.data?.message || "Failed to delete student");
      }
    }
  };

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
    {
      header: "Actions",
      key: "actions",
      render: (student) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingStudent(student);
              setIsModalOpen(true);
            }}
            className="text-slate-400 hover:text-blue-600 transition p-1.5 rounded hover:bg-blue-50"
            title="Edit Student"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteStudent(student._id || student.id)}
            className="text-slate-400 hover:text-red-600 transition p-1.5 rounded hover:bg-red-50"
            title="Delete Student"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3 text-slate-800">
              <span className="text-3xl text-blue-600">🎓</span>
              <h1 className="text-3xl font-medium tracking-tight">Students</h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Review eligible candidates, application counts, and interview status.
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-4">
            <SearchBar
              onChange={setSearchTerm}
              placeholder="Search students"
              value={searchTerm}
            />
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 whitespace-nowrap"
            >
              Add Student
            </button>
          </div>
        </section>



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

        <StudentModal
          isOpen={isModalOpen}
          initialData={editingStudent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          onSubmit={async (data) => {
            if (editingStudent) {
              await handleEditStudent(data);
            } else {
              await handleAddStudent(data);
            }
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
        />
      </div>
    </Layout>
  );
}

export default Students;
