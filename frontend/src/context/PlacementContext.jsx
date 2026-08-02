import { activity, applications, companies, students } from "../data/mockData";
import { useMemo } from "react";
import { PlacementContext } from "./placementStore";

export function PlacementProvider({ children }) {
  const stats = useMemo(
    () => ({
      students: students.length,
      companies: companies.length,
      applications: applications.length,
      selected: applications.filter((item) => item.status === "Selected").length,
    }),
    []
  );

  const value = {
    activity,
    applications,
    companies,
    stats,
    students,
  };

  return (
    <PlacementContext.Provider value={value}>
      {children}
    </PlacementContext.Provider>
  );
}
