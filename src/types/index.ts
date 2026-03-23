/**
 * Types principaux de l'application ForoCI
 * Modèles de données pour le fitness tracker
 */

// Catégories d'exercices disponibles
export type ExerciseCategory = 'musculation' | 'cardio' | 'yoga' | 'stretching';

// Exercice du catalogue
export interface Exercise {
  id: number;
  name: string;
  category: ExerciseCategory;
  muscleGroup: string;
  icon: string;
  description: string;
}

// Série d'un exercice dans une séance
export interface ExerciseSet {
  reps: number;
  weight: number;
  duration?: number; // En secondes, pour les exercices chronométrés
}

// Exercice réalisé dans une séance (avec ses séries)
export interface WorkoutExercise {
  exerciseId: number;
  sets: ExerciseSet[];
}

// Séance d'entraînement complète
export interface Workout {
  id: number;
  date: string;
  exercises: WorkoutExercise[];
  totalDuration: number; // En minutes
  caloriesBurned: number;
  notes: string;
}

// Programme d'entraînement hebdomadaire
export interface Program {
  id: number;
  name: string;
  days: string[]; // Activité prévue pour chaque jour de la semaine
  duration: number; // En semaines
}

// Entrée de suivi du poids corporel
export interface WeightEntry {
  date: string;
  value: number; // En kg
}

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
