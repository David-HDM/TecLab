import { create } from "zustand";
import { supabase } from "../services/supabaseClient";
import * as authService from "../services/authService";
import type { RegisterData } from "../services/authService";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  loading: true, // true hasta restaurar la sesión guardada
  signIn: async (email, password) => {
    await authService.signIn(email, password);
    useAuthStore.setState({ user: await authService.getCurrentUser() });
  },
  signUp: async (data) => {
    await authService.signUp(data);
    useAuthStore.setState({ user: await authService.getCurrentUser() });
  },
  signOut: async () => {
    await authService.signOut();
    useAuthStore.setState({ user: null });
  },
}));

// Se llama una vez al iniciar la app (main.tsx)
export function initAuth() {
  authService.getCurrentUser().then((user) => useAuthStore.setState({ user, loading: false }));

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      useAuthStore.setState({ user: null, loading: false });
      return;
    }
    // setTimeout evita llamar a Supabase dentro del propio callback (puede bloquearse)
    setTimeout(async () => {
      const user = await authService.getCurrentUser();
      useAuthStore.setState({ user, loading: false });
    }, 0);
  });

  return () => data.subscription.unsubscribe();
}