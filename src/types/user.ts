export interface Profile {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  carrera: string;
  semestre: number;
  numero_control: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string; // nombres del perfil; así Navbar y Dashboard siguen funcionando
  profile: Profile | null;
}