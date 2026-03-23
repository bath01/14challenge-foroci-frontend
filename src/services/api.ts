/**
 * Service API pour communiquer avec le backend Next.js
 * Pour l'instant, les données sont en local (mockData)
 * Ce fichier sera connecté au backend quand il sera prêt
 */

// URL de base de l'API (à configurer selon l'environnement)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Endpoints disponibles (référence documentation)
export const ENDPOINTS = {
  // Séances
  WORKOUTS: '/workouts',
  WORKOUT_DETAIL: (id: number) => `/workouts/${id}`,

  // Exercices
  EXERCISES: '/exercises',

  // Programmes
  PROGRAMS: '/programs',
  PROGRAM_DETAIL: (id: number) => `/programs/${id}`,

  // Statistiques et progression
  STATS_SUMMARY: '/stats/summary',
  STATS_PROGRESS: '/stats/progress',
  STATS_CALENDAR: '/stats/calendar',

  // Métriques (poids corporel)
  METRICS_WEIGHT: '/metrics/weight',
} as const;

/**
 * Requête GET générique vers l'API
 * À utiliser quand le backend sera connecté
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }
  return response.json();
}

/**
 * Requête POST générique vers l'API
 */
export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }
  return response.json();
}
