export interface Question {
  id: string;
  topicId: string;
  concepto: string;
  enunciado: string;
  opciones: string[];
  correcta: number; // índice de la opción correcta
  explicacion: string;
}