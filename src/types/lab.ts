export interface Lab {
  id: string;
  titulo: string;
  descripcion_corta: string;
  img_oferta: string | null;
  img_detalle: string | null;
  estatus: string;
  descripcion_larga: string;
  palabras_clave: string[] | null;
}