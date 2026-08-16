import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false); // No longer needed to be true initially since we resolve user synchronously

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && user) {
      setUser(null);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      await api.post("/auth/register", userData);
      return await login(userData.email, userData.password);
    } catch (error) {
      const data = error.response?.data;
      const errMsg = data?.errors ? data.errors.map(e => e.msg).join(", ") : data?.message;
      return { success: false, error: errMsg || "Signup failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, role, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
