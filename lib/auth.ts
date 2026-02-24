import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { createContext, useContext, useEffect, useState } from "react";

// Types for our Auth Context
interface User {
  _id: Id<"users">;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Mock implementation of Better Auth client using Convex
// In a real app, this would be `import { createAuthClient } from "better-auth/react"`
export const authClient = {
  signIn: async (email: string, name: string) => {
    // This is where we'd call the real auth provider
    // For this demo, we simulate it by creating a session directly
    return { email, name };
  },
  signOut: async () => {
    // Clear session
  }
};
