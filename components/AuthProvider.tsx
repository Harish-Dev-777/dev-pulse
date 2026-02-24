"use client";

import { ReactNode } from "react";
import { AuthContext, User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const login = async () => {
    // Better Auth will handle the redirect/popup for social login
    // or we can use signIn.email() etc.
    // For now, let's trigger the Google sign-in as a default test
    await authClient.signIn.social({
      provider: "github", // Change to github or whatever is configured
      callbackURL: "/",
    });
  };

  const logout = async () => {
    await authClient.signOut();
  };

  // Map Better Auth user to our User type
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
