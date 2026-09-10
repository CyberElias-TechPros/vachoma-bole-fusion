import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useProfile } from "@/hooks/use-profile";
import type { Profile } from "@/hooks/use-profile";
import type { User, Session } from "@supabase/supabase-js";

interface AuthResult {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: Partial<Profile>) => Promise<AuthResult>;
  uploadAvatar: (file: File) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Single auth subscription for the whole app; the profile hook reuses it.
  const auth = useSupabaseAuth();
  const profileData = useProfile(auth.user);

  const value = useMemo<AuthContextType>(
    () => ({
      user: auth.user,
      session: auth.session,
      profile: profileData.profile,
      loading: auth.loading || profileData.loading,
      isAuthenticated: !!auth.user,
      isAdmin: profileData.isAdmin,
      isStaff: profileData.isStaff,
      signUp: auth.signUp,
      signIn: auth.signIn,
      signOut: auth.signOut,
      resetPassword: auth.resetPassword,
      updateProfile: profileData.updateProfile,
      uploadAvatar: profileData.uploadAvatar,
    }),
    [auth, profileData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
