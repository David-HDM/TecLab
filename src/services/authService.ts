import { supabase } from "./supabaseClient";
import type { Profile, User } from "../types/user";

export interface RegisterData {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  carrera: string;
  semestre: number;
  numero_control: string;
  email: string;
  password: string;
}

export async function signUp(data: RegisterData): Promise<void> {
  const { data: res, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });
  if (error) throw error;
  if (!res.user) throw new Error("No se pudo crear el usuario.");
  if (!res.session) {
    throw new Error("Cuenta creada, pero requiere confirmar el correo antes de continuar.");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: res.user.id,
    nombres: data.nombres,
    apellido_paterno: data.apellido_paterno,
    apellido_materno: data.apellido_materno,
    carrera: data.carrera,
    semestre: data.semestre,
    numero_control: data.numero_control,
  });
  if (profileError) throw profileError;
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const authUser = session.user;
  const profile = await getProfile(authUser.id);
  const email = authUser.email ?? "";

  return {
    id: authUser.id,
    email,
    nombre: profile?.nombres ?? email.split("@")[0],
    profile,
  };
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/restablecer-contrasena`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}