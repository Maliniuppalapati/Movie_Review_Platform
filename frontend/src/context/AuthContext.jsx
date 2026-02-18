import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: { username, email, password },
      });
      login(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      register,
      loading,
      isAuthed: !!token,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
