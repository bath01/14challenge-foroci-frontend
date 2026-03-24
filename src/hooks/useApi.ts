/**
 * Hook générique pour le chargement de données depuis l'API
 * Gère le loading, les erreurs et le rafraîchissement
 */

import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
  /** Données chargées */
  data: T | null;
  /** Chargement en cours */
  isLoading: boolean;
  /** Message d'erreur */
  error: string | null;
  /** Relancer le chargement */
  refresh: () => void;
}

/**
 * Charge des données depuis une fonction async et gère l'état
 * @param fetchFn - Fonction qui retourne une promesse avec les données
 * @param immediate - Lancer automatiquement au montage (défaut: true)
 */
export function useApi<T>(fetchFn: () => Promise<T>, immediate = true): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, isLoading, error, refresh: execute };
}
