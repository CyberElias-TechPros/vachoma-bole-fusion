
import { createContext, useContext, ReactNode } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useProfile } from "@/hooks/use-profile";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    email: string;
    phone: string | null;
    role: 'admin' | 'manager' | 'staff' | 'customer';
    created_at: string;
    updated_at: string;
  } | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  updateProfile: (updates: any) => Promise<{ success: boolean; data?: any; error?: any }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; data?: any; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useSupabaseAuth();
  const profileData = useProfile();

  const value = {
    ...auth,
    ...profileData,
    isAuthenticated: !!auth.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
