import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiWalletLogin, getToken, clearToken } from "./api";

export type UserRole = "hospital" | "registrar" | "public";

interface AuthState {
  address: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (address: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem("jwt_token");
    const role = localStorage.getItem("role") as UserRole | null;
    const address = localStorage.getItem("wallet_address");
    return {
      address: token ? address : null,
      role: token ? role : null,
      isAuthenticated: !!token,
    };
  });

  const login = useCallback(async (address: string, role: UserRole) => {
    try {
      await apiWalletLogin(address, role);
      localStorage.setItem("role", role);
      localStorage.setItem("wallet_address", address);
      setAuth({ address, role, isAuthenticated: true });
    } catch (err: any) {
      throw new Error(err.message || "Login failed");
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem("role");
    localStorage.removeItem("wallet_address");
    setAuth({ address: null, role: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
