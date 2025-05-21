// app/components/context/AuthProvider.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const router = useRouter();

  useEffect(() => {
    console.log("NextAuth Session Status:", status, "Session Data:", session);
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
      if (status === "authenticated" && session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
        const userRole =
          session.user.email?.toLowerCase() === "tpoppypie@gmail.com"
            ? "admin"
            : "user";
        setRole(userRole);
        if (typeof window !== "undefined") {
          localStorage.setItem("role", userRole);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setRole("user");
        if (typeof window !== "undefined") {
          localStorage.removeItem("role");
        }
      }
    }
  }, [status, session]);

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    console.log("Login should be handled by next-auth signIn");
    setLoading(false);
    return { error: "Use the login page to authenticate" };
  };

  const logout = async () => {
    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });
      setUser(null);
      setIsAuthenticated(false);
      setRole("user");
      if (typeof window !== "undefined") {
        localStorage.removeItem("role");
      }
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to log out");
    }
  };

  const isAdmin = () => role === "admin";

  const value = {
    user,
    loading,
    error,
    role,
    isAdmin,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};