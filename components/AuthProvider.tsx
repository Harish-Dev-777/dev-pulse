"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "@/lib/auth"; // We'll need to export the context from lib/auth or move it here
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  
  // Load token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("auth_token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setToken(stored);
  }, []);

  // Check session validity with Convex
  // We use "skip" if no token, so it doesn't query
  const sessionData = useQuery(api.auth.getSession, token ? { token } : "skip");
  
  const createUser = useMutation(api.users.create);
  const createSession = useMutation(api.auth.createSession);
  const deleteSession = useMutation(api.auth.deleteSession);

  const login = async (email: string, name: string) => {
    try {
      // 1. Create or get user
      const userId = await createUser({ email, name });
      
      // 2. Create session
      const newToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await createSession({
        userId,
        token: newToken,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // 3. Store token
      localStorage.setItem("auth_token", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await deleteSession({ token });
      } catch (e) {
        console.error("Logout error", e);
      }
    }
    localStorage.removeItem("auth_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: sessionData?.user ?? null, 
        isLoading: token !== null && sessionData === undefined,
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
