/**
 * Service API pour communiquer avec le backend ForoCI
 * Gère l'authentification JWT et les requêtes vers l'API REST
 */

import { LoginDto, RegisterDto, AuthResponse } from '../types';

// URL de base de l'API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.fitness.chalenge14.com/api/v1';

// Token JWT stocké en mémoire (sera persisté via AuthContext)
let authToken: string | null = null;

/** Définir le token JWT pour les requêtes authentifiées */
export function setAuthToken(token: string | null) {
  authToken = token;
}

/** Récupérer le token courant */
export function getAuthToken(): string | null {
  return authToken;
}

// Endpoints disponibles
export const ENDPOINTS = {
  // Authentification
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',

  // Utilisateur
  USER_ME: '/users/me',
  USER_PROGRAMS: '/users/me/programs',

  // Séances
  WORKOUTS: '/workouts',
  WORKOUT_DETAIL: (id: number) => `/workouts/${id}`,
  WORKOUT_EXERCISES: (id: number) => `/workouts/${id}/exercises`,

  // Exercices
  EXERCISES: '/exercises',
  EXERCISE_DETAIL: (id: number) => `/exercises/${id}`,

  // Programmes
  PROGRAMS: '/programs',
  PROGRAM_DETAIL: (id: number) => `/programs/${id}`,
  PROGRAM_WORKOUTS: (id: number) => `/programs/${id}/workouts`,
  PROGRAM_ENROLL: (id: number) => `/programs/${id}/enroll`,

  // Métriques
  METRICS_WEIGHT: '/metrics/weight',
  METRICS_EXERCISE_LOGS: '/metrics/exercise-logs',
  METRICS_CALENDAR: '/metrics/calendar',
} as const;

/**
 * Construire les headers avec le token JWT si disponible
 */
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

/**
 * Requête GET générique vers l'API
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: buildHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erreur API: ${response.status}`);
  }
  return response.json();
}

/**
 * Requête POST générique vers l'API
 */
export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erreur API: ${response.status}`);
  }
  return response.json();
}

/**
 * Requête PATCH générique vers l'API
 */
export async function apiPatch<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erreur API: ${response.status}`);
  }
  return response.json();
}

/**
 * Requête DELETE générique vers l'API
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erreur API: ${response.status}`);
  }
  return response.json();
}

// --- Fonctions d'authentification ---

/** Inscription d'un nouvel utilisateur */
export async function register(data: RegisterDto): Promise<AuthResponse> {
  return apiPost<AuthResponse>(ENDPOINTS.AUTH_REGISTER, data);
}

/** Connexion d'un utilisateur existant */
export async function login(data: LoginDto): Promise<AuthResponse> {
  return apiPost<AuthResponse>(ENDPOINTS.AUTH_LOGIN, data);
}
