/**
 * Types principaux de l'application ForoCI
 * Modèles de données alignés sur l'API backend
 */

// --- Authentification ---

// Données d'inscription
export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Données de connexion
export interface LoginDto {
  email: string;
  password: string;
}

// Réponse d'authentification (register/login)
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// Utilisateur authentifié
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  height?: number | null;
  weight?: number | null;
  birthDate?: string | null;
}

// --- Exercices ---

// Catégories d'exercices (enum backend)
export type ExerciseCategory = 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'ABS' | 'CARDIO' | 'FULL_BODY';

// Type d'exercice
export type ExerciseType = 'REPS' | 'DURATION';

// Exercice du catalogue
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  type: ExerciseType;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// --- Séances (Workouts) ---

// Exercice dans une séance (pivot workout ↔ exercise)
export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: number;
  reps: number | null;
  duration: number | null;
  calories: number;
  order: number;
  exercise?: Exercise; // Inclus dans le détail
}

// Séance d'entraînement
export interface Workout {
  id: string;
  name: string;
  description: string;
  order: number;
  programId: string;
  createdAt: string;
  updatedAt: string;
  exercises?: WorkoutExercise[]; // Inclus dans le détail
  _count?: { exercises: number }; // Inclus dans la liste
}

// --- Programmes ---

// Niveau de difficulté
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Programme d'entraînement
export interface Program {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
  workouts?: Workout[]; // Inclus dans le détail
  _count?: { workouts: number }; // Inclus dans la liste
}

// --- Métriques ---

// Entrée de suivi du poids corporel
export interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  createdAt: string;
}

// --- UI ---

// Données pour les graphiques en barres
export interface ChartDataPoint {
  value: number;
  label: string;
}

// Mode du timer (exercice ou repos)
export type TimerMode = 'exercise' | 'rest';

// Onglets de la navigation principale
export type TabKey = 'home' | 'workouts' | 'programs' | 'timer' | 'about';

// Membre de l'équipe (page À propos)
export interface TeamMember {
  name: string;
  role: string;
}
