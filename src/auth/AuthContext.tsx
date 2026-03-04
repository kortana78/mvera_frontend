import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, me, signup as signupApi } from "../api/auth";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mvera_token");
    if (!token) {
      setLoading(false);
      return;
    }
    me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("mvera_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const token = await loginApi(email, password);
    localStorage.setItem("mvera_token", token);
    const userData = await me();
    setUser(userData);
  }

  async function signup(name: string, email: string, password: string) {
    const token = await signupApi(name, email, password);
    localStorage.setItem("mvera_token", token);
    const userData = await me();
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("mvera_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
