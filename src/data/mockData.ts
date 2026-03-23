/**
 * Données fictives pour le développement
 * Reproduisent fidèlement les données de la maquette
 */

import { Exercise, Workout, Program, WeightEntry, TeamMember } from '../types';

// Catalogue d'exercices disponibles (icônes Ionicons)
export const exercisesCatalog: Exercise[] = [
  { id: 1, name: 'Pompes', category: 'musculation', muscleGroup: 'Pectoraux', icon: 'fitness', description: 'Flexion-extension des bras au sol' },
  { id: 2, name: 'Squats', category: 'musculation', muscleGroup: 'Jambes', icon: 'body', description: 'Flexion des genoux, dos droit' },
  { id: 3, name: 'Tractions', category: 'musculation', muscleGroup: 'Dos', icon: 'barbell', description: 'Traction à la barre fixe' },
  { id: 4, name: 'Abdominaux', category: 'musculation', muscleGroup: 'Abdos', icon: 'flame', description: 'Crunchs classiques' },
  { id: 5, name: 'Course', category: 'cardio', muscleGroup: 'Cardio', icon: 'walk', description: 'Course à pied' },
  { id: 6, name: 'Burpees', category: 'cardio', muscleGroup: 'Full Body', icon: 'flash', description: 'Squat thrust avec saut' },
  { id: 7, name: 'Planche', category: 'musculation', muscleGroup: 'Core', icon: 'accessibility', description: 'Gainage statique' },
  { id: 8, name: 'Fentes', category: 'musculation', muscleGroup: 'Jambes', icon: 'footsteps', description: 'Fentes avant alternées' },
  { id: 9, name: 'Yoga Flow', category: 'yoga', muscleGroup: 'Souplesse', icon: 'leaf', description: 'Enchaînement de postures' },
  { id: 10, name: 'Étirements', category: 'stretching', muscleGroup: 'Souplesse', icon: 'body', description: 'Étirements complets' },
];

// Programmes d'entraînement
export const programs: Program[] = [
  { id: 1, name: 'Force Totale', days: ['Pectoraux/Bras', 'Jambes', 'Repos', 'Dos/Épaules', 'Cardio', 'Full Body', 'Repos'], duration: 8 },
  { id: 2, name: 'Cardio Brûleur', days: ['HIIT', 'Course', 'Repos', 'Burpees', 'Course', 'HIIT', 'Repos'], duration: 4 },
  { id: 3, name: 'Souplesse Zen', days: ['Yoga', 'Étirements', 'Repos', 'Yoga', 'Étirements', 'Yoga', 'Repos'], duration: 6 },
];

// Historique des séances
export const workoutHistory: Workout[] = [
  {
    id: 1, date: '21/03/2026',
    exercises: [
      { exerciseId: 1, sets: [{ reps: 15, weight: 0 }, { reps: 12, weight: 0 }, { reps: 10, weight: 0 }] },
      { exerciseId: 2, sets: [{ reps: 20, weight: 0 }, { reps: 18, weight: 0 }] },
      { exerciseId: 4, sets: [{ reps: 25, weight: 0 }, { reps: 20, weight: 0 }, { reps: 15, weight: 0 }] },
    ],
    totalDuration: 45, caloriesBurned: 320, notes: 'Bonne séance, forme du matin',
  },
  {
    id: 2, date: '20/03/2026',
    exercises: [
      { exerciseId: 5, sets: [{ reps: 1, weight: 0, duration: 1800 }] },
      { exerciseId: 6, sets: [{ reps: 10, weight: 0 }, { reps: 8, weight: 0 }] },
    ],
    totalDuration: 40, caloriesBurned: 450, notes: 'Cardio intense',
  },
  {
    id: 3, date: '19/03/2026',
    exercises: [
      { exerciseId: 3, sets: [{ reps: 8, weight: 0 }, { reps: 6, weight: 0 }] },
      { exerciseId: 7, sets: [{ reps: 1, weight: 0, duration: 60 }, { reps: 1, weight: 0, duration: 45 }] },
    ],
    totalDuration: 35, caloriesBurned: 280, notes: '',
  },
  {
    id: 4, date: '18/03/2026',
    exercises: [
      { exerciseId: 2, sets: [{ reps: 20, weight: 10 }, { reps: 15, weight: 15 }] },
      { exerciseId: 8, sets: [{ reps: 12, weight: 0 }, { reps: 10, weight: 0 }] },
    ],
    totalDuration: 50, caloriesBurned: 380, notes: 'Jambes en feu',
  },
  {
    id: 5, date: '17/03/2026',
    exercises: [
      { exerciseId: 9, sets: [{ reps: 1, weight: 0, duration: 2400 }] },
      { exerciseId: 10, sets: [{ reps: 1, weight: 0, duration: 900 }] },
    ],
    totalDuration: 55, caloriesBurned: 200, notes: 'Récupération active',
  },
];

// Historique du poids corporel
export const weightHistory: WeightEntry[] = [
  { date: '16/03', value: 78.5 },
  { date: '17/03', value: 78.2 },
  { date: '18/03', value: 78.0 },
  { date: '19/03', value: 77.8 },
  { date: '20/03', value: 77.5 },
  { date: '21/03', value: 77.3 },
];

// Jours du calendrier Mars 2026
export const calendarWorkoutDays = [16, 17, 18, 19, 20, 21];
export const calendarScheduledDays = [22, 23, 25, 26, 27];

// Équipe du projet
export const teamMembers: TeamMember[] = [
  { name: 'Bath Dorgeles', role: 'Chef de projet & Front' },
  { name: 'Oclin Marcel C.', role: 'Dev Mobile (React Native)' },
  { name: 'Rayane Irie', role: 'Back-end (Next.js)' },
];

// Récupère un exercice par son identifiant
export function getExerciseById(id: number): Exercise | undefined {
  return exercisesCatalog.find(e => e.id === id);
}
