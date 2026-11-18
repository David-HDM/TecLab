export interface Topic {
  id: string;
  lab_id: string;
  titulo: string;
  descripcion: string;
  nivel: string;
}

export interface TopicProgress {
  topic_id: string;
  titulo: string;
  nivel: string;
  progreso: number; // 0-100
  mejor_puntaje: number | null; // 0-100
}

export interface PracticeProgress {
  practice_id: string;
  topic_id: string;
  titulo: string;
  orden: number;
  progreso: number;
  completada: boolean;
}