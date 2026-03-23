/**
 * Fonctions utilitaires de formatage
 */

// Formate un nombre de secondes en "MM:SS"
export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
