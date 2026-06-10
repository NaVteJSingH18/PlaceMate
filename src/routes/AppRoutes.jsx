import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Companies from "../pages/Companies";
import Applications from "../pages/Applications";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/applications" element={<Applications />} />
    </Routes>
  );
}

export default AppRoutes;