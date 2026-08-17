import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user } = useAuth();
  const [studentRecord, setStudentRecord] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    cgpa: "",
    skills: "",
    resume: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      if (!user.studentId) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          branch: "",
          cgpa: "",
          skills: "",
          resume: null,
        });
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await api.get(`/students/${user.studentId}`);
        const student = response.data;
        setStudentRecord(student);
        setFormData({
          name: student.name || user.name || "",
          email: user.email || "",
          branch: student.branch || "",
          cgpa: student.cgpa ?? "",
          skills: (student.skills || []).join(", "),
          resume: null,
        });
      } catch (error) {
        console.error("Failed to load student profile", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.resume) {
        const fileData = new FormData();
        fileData.append("resume", formData.resume);
        await api.post("/students/upload-resume", fileData);
      }

      if (user?.studentId) {
        const updateData = {
          name: formData.name,
          branch: formData.branch,
          cgpa: formData.cgpa ? Number(formData.cgpa) : 0,
          skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
        };
        await api.put(`/students/${user.studentId}`, updateData);
      }

      if (user?.studentId) {
        const response = await api.get(`/students/${user.studentId}`);
        setStudentRecord(response.data);
      }
      
      setIsEditing(false);
      window.alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      window.alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return window.alert("New passwords do not match");
    }
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      window.alert("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      window.alert(error.response?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await api.delete("/auth/account");
        window.alert("Account deleted successfully");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } catch (error) {
        window.alert(error.response?.data?.message || "Failed to delete account");
      }
    }
  };

  if (loadingProfile) {
    return (
      <Layout>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading profile...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-3 text-slate-800">
            <span className="text-3xl text-blue-600">👤</span>
            <h1 className="text-3xl font-medium tracking-tight">My Profile</h1>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            View and manage your placement profile details.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(28,44,92,0.06)]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>

              {user?.role === "student" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Branch / Major
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g. React, Node.js, Python"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Resume Upload
                </label>
                {isEditing ? (
                  <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                ) : (
                  <div className="text-sm text-slate-500 italic">
                    {studentRecord?.resume?.url ? (
                      <a
                        className="font-semibold not-italic text-blue-600 hover:underline"
                        href={studentRecord.resume.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        View uploaded resume
                      </a>
                    ) : (
                      "No resume uploaded."
                    )}
                  </div>
                )}
                </div>
                </>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#1c2c5c] rounded-full hover:bg-blue-900 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(28,44,92,0.06)] mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Security Settings</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md mb-8">
            <h3 className="text-md font-medium text-slate-800">Change Password</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#1c2c5c] rounded-full hover:bg-blue-900 transition-colors shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>

          <div className="pt-6 border-t border-red-100">
            <h3 className="text-md font-medium text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-500 mb-5">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
