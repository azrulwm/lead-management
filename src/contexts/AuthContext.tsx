"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials
const MOCK_CREDENTIALS = {
  username: "admin",
  password: "password123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on page load
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);

    // Listen for localStorage changes (when manually deleted)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isAuthenticated") {
        if (e.newValue === null || e.newValue === "false") {
          setIsAuthenticated(false);
        } else if (e.newValue === "true") {
          setIsAuthenticated(true);
        }
      }
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically (in case storage is changed in same tab)
    const interval = setInterval(() => {
      const currentAuthStatus = localStorage.getItem("isAuthenticated");
      const shouldBeAuthenticated = currentAuthStatus === "true";
      if (shouldBeAuthenticated !== isAuthenticated) {
        setIsAuthenticated(shouldBeAuthenticated);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    if (
      username === MOCK_CREDENTIALS.username &&
      password === MOCK_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
