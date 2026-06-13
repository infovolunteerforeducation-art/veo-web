"use client";

import { createContext, useContext, useState, useCallback } from "react";
import {
  StoredUser,
  getUsers,
  getSessionEmail,
  setSessionEmail,
  authLogin,
  authRegister,
  authChangePassword,
} from "@/lib/auth-store";

type AuthContextValue = {
  user: StoredUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (
    currentPw: string,
    newPw: string
  ) => Promise<{ ok: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => {
    if (typeof window === "undefined") return null;
    const email = getSessionEmail();
    if (email) {
      const users = getUsers();
      return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
    }
    return null;
  });
  const [loading] = useState(false);

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      const result = authLogin(email, password);
      if (result) {
        setUser(result);
        return { ok: true };
      }
      return { ok: false, error: "Email hoặc mật khẩu không đúng. Vui lòng thử lại." };
    },
    []
  );

  const logout = useCallback(() => {
    setSessionEmail(null);
    setUser(null);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      phone: string,
      password: string
    ): Promise<{ ok: boolean; error?: string }> => {
      return authRegister(name, email, phone, password);
    },
    []
  );

  const changePassword = useCallback(
    async (currentPw: string, newPw: string): Promise<{ ok: boolean; error?: string }> => {
      if (!user) return { ok: false, error: "Bạn chưa đăng nhập." };
      return authChangePassword(user.email, currentPw, newPw);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
