import { create } from "zustand";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (nombre: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

// TODO: reemplazar por authService con Supabase
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  signIn: async (email) => {
    set({ user: { id: "demo", nombre: email.split("@")[0], email } });
  },
  signUp: async (nombre, email) => {
    set({ user: { id: "demo", nombre, email } });
  },
  signOut: () => set({ user: null }),
}));