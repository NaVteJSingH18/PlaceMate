import { useState, useEffect, useMemo, useCallback } from "react";
import { PlacementContext } from "./placementStore";
import { useAuth } from "./AuthContext";
import api from "../services/api";

export function PlacementProvider({ children }) {
  const { user } = useAuth();
  
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    applications: 0,
    selected: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) {
      setStudents([]);
      setCompanies([]);
      setApplications([]);
      setActivity([]);
      return;
    }
    if (!loading) setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get("/jobs"),
        api.get("/stats")
      ]);
      setCompanies(jobsRes.data.jobs || []);
      setStats(statsRes.data || { students: 0, companies: 0, applications: 0, selected: 0 });

      if (user.role === "admin") {
        const studentsRes = await api.get("/students");
        setStudents(studentsRes.data || []);
      }

      if (user.role === "admin") {
        const appsRes = await api.get("/applications");
        setApplications(appsRes.data || []);
      } else {
        const appsRes = await api.get("/applications/my");
        setApplications(appsRes.data || []);
      }
      
      setActivity([]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    activity,
    applications,
    companies,
    stats,
    students,
    loading,
    refreshData: fetchData
  };

  return (
    <PlacementContext.Provider value={value}>
      {children}
    </PlacementContext.Provider>
  );
}
