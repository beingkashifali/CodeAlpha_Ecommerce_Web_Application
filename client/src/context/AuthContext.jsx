import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const fetchMe = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    setUser(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
      phone,
    });
    setUser(data);
    return data;
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refetch: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
