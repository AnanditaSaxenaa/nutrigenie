// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// ✅ Use env var for backend API base URL
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user on mount (restore session from cookie)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          method: "GET",
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsLoggedIn(true);
        } else if (res.status === 401 || res.status === 403) {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // ✅ Logout handler
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem("dietPlan");
      setUser(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook to consume AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
