import type { Lab } from "../types/lab";
import type { Practice, PracticeProgressRecord } from "../types/practice";
import type { QuizAnswer, QuizAttempt, Question } from "../types/quiz";
import type { PracticeProgress, Topic, TopicProgress } from "../types/topic";
import { supabase } from "../services/supabaseClient";

const BASE = '/api'; 

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;

  const headers = new Headers(init?.headers);
  if (session?.access_token) headers.set("Authorization", `Bearer ${session.access_token}`);
  if (init?.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${BASE}${url}`, { ...init, headers });
  if (!response.ok) {
    const detail = await response.text();
    let message = detail;
    try {
      const body: unknown = JSON.parse(detail);
      if (
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error;
      }
    } catch {
      // Si no es JSON, se conserva el cuerpo original de la respuesta.
    }
    throw new Error(message || `${BASE}${url} → ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getLabs:              () => json<Lab[]>('/labs'),
  getLab:               (id: string) => json<Lab>(`/labs/${id}`),
  startLab:             (id: string) =>
    json<Lab>(`/labs/${encodeURIComponent(id)}/start`, { method: "POST" }),
  getTopicsByLab:       (labId: string) => json<Topic[]>(`/labs/${labId}/topics`),
  getTopic:             (id: string) => json<Topic>(`/topics/${id}`),
  getPracticesByTopic:  (topicId: string) => json<Practice[]>(`/topics/${topicId}/practices`),
  getPractice:          (id: string) => json<Practice>(`/practices/${id}`),
  getQuestionsForPractice: (practiceId: string) =>
    json<Question[]>(`/questions?practice_id=${encodeURIComponent(practiceId)}`),
  getDashboardTopics: (labId: string) =>
    json<TopicProgress[]>(`/dashboard/topics?lab_id=${encodeURIComponent(labId)}`),
  getDashboardPractices: (topicId: string) =>
    json<PracticeProgress[]>(`/dashboard/practices?topic_id=${encodeURIComponent(topicId)}`),
  getQuizHistory: (practiceId: string) =>
    json<QuizAttempt[]>(`/dashboard/quiz-history?practice_id=${encodeURIComponent(practiceId)}`),
  savePracticeProgress: (
    practiceId: string,
    progress: { objetivos_completados: number[]; completada: boolean },
  ) => json<PracticeProgressRecord>(`/practices/${encodeURIComponent(practiceId)}/progress`, {
    method: "PUT",
    body: JSON.stringify(progress),
  }),
  submitQuizAttempt: (practiceId: string, respuestas: QuizAnswer[]) =>
    json<QuizAttempt>(`/practices/${encodeURIComponent(practiceId)}/quiz-attempts`, {
      method: "POST",
      body: JSON.stringify({ respuestas }),
    }),
};