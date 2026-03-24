/**
 * Service de planification locale des séances
 * Stocke les séances planifiées par jour dans AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEDULE_KEY = 'foroci_schedule';

/** Entrée du planning : une séance prévue un jour donné */
export interface ScheduleEntry {
  /** Date au format YYYY-MM-DD */
  date: string;
  /** ID de la séance */
  workoutId: string;
  /** Nom de la séance (pour affichage rapide sans fetch) */
  workoutName: string;
  /** ID du programme (optionnel) */
  programId?: string;
  /** Nom du programme (optionnel) */
  programName?: string;
}

/** Charger tout le planning */
export async function loadSchedule(): Promise<ScheduleEntry[]> {
  try {
    const data = await AsyncStorage.getItem(SCHEDULE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Sauvegarder le planning complet */
async function saveSchedule(entries: ScheduleEntry[]): Promise<void> {
  await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(entries));
}

/** Ajouter une séance au planning pour une date */
export async function addToSchedule(entry: ScheduleEntry): Promise<ScheduleEntry[]> {
  const schedule = await loadSchedule();
  // Remplacer si déjà une entrée pour cette date
  const filtered = schedule.filter(e => e.date !== entry.date);
  filtered.push(entry);
  await saveSchedule(filtered);
  return filtered;
}

/** Supprimer une entrée du planning */
export async function removeFromSchedule(date: string): Promise<ScheduleEntry[]> {
  const schedule = await loadSchedule();
  const filtered = schedule.filter(e => e.date !== date);
  await saveSchedule(filtered);
  return filtered;
}

/** Récupérer l'entrée d'un jour spécifique */
export async function getScheduleForDate(date: string): Promise<ScheduleEntry | null> {
  const schedule = await loadSchedule();
  return schedule.find(e => e.date === date) || null;
}

/** Récupérer les jours planifiés d'un mois (numéros de jours) */
export function getScheduledDays(schedule: ScheduleEntry[], year: number, month: number): number[] {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return schedule
    .filter(e => e.date.startsWith(prefix))
    .map(e => parseInt(e.date.split('-')[2], 10));
}
