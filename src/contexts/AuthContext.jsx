import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkTokenAndFetchProfile = useCallback(async (possibleToken) => {
    const token = possibleToken || localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/profile", {
        headers: {
          authorization: `${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid token");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Profile fetch failed:", err);
      logout();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkTokenAndFetchProfile();
  }, []);

  const displayName = user ? user.firstName + " " + user.lastName : "";

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const { token } = await res.json();
      console.log("TOKEN : ", token);
      localStorage.setItem("token", token);

      await checkTokenAndFetchProfile(token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (formData) => {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error("Registration failed");
    }
    // Assume server returns a token (same shape as /login)
    const { token } = await res.json();
    localStorage.setItem("token", token);

    // After registration, fetch profile to set user
    await checkTokenAndFetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    displayName,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  console.log("LOAD?I: ", loading);

  return (
    <AuthContext.Provider value={value}>
      {loading ? "Loading..." : children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
