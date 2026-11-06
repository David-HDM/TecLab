export interface Topic {
  id: string;
  titulo: string;
  descripcion: string;
}

export interface TopicProgress {
  topicId: string;
  titulo: string;
  progreso: number; // 0-100
  mejorPuntaje: number | null; // 0-100
}