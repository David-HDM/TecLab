import { create } from "zustand";
import { supabase } from "../services/supabaseClient";
import * as authService from "../services/authService";
import type { RegisterData } from "../services/authService";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (numeroControl: string, password: string) => Promise<void>;
  signUp: (data: RegisterData) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(() => ({
  user: null,
  loading: true, // true hasta restaurar la sesión guardada
  signIn: async (numeroControl, password) => {
    await authService.signIn(numeroControl, password);
    useAuthStore.setState({ user: await authService.getCurrentUser() });
  },
  signUp: async (data) => {
    const result = await authService.signUp(data);
    if (!result.needsEmailConfirmation) {
      useAuthStore.setState({ user: await authService.getCurrentUser() });
    }
    return result;
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