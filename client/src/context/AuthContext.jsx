import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("evolve_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // global Fetch Interceptor for 401 Expired Tokens 
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        console.warn("Session expired. Auto-logging out...");

        setUser(null);
        localStorage.removeItem("evolve_user");
        window.location.href = "/login";
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []); 

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("evolve_user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch("/api/v1/user/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("evolve_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
