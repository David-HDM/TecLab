export interface Question {
  id: string;
  practice_id: string;
  concepto: string;
  enunciado: string;
  opciones: string[];
  correcta: number; // índice de la opción correcta
  explicacion: string;
}

export interface QuizAttempt {
  id: number | string;
  intento: number;
  puntaje: number;
  correctas: number;
  total: number;
  fecha: string;
}

export interface QuizAnswer {
  pregunta: string;
  elegida: number;
}