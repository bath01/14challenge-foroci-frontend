/**
 * Hook personnalisé pour la gestion du timer exercice/repos
 * Gère le chronomètre d'exercice (montant) et le compte à rebours de repos (descendant)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { TimerMode } from '../types';

interface UseTimerReturn {
  exerciseTimer: number;
  restTimer: number;
  timerRunning: boolean;
  timerMode: TimerMode;
  restDuration: number;
  setRestDuration: (duration: number) => void;
  startExerciseTimer: () => void;
  startRestTimer: (duration?: number) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
}

export function useTimer(): UseTimerReturn {
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>('exercise');
  const [restDuration, setRestDuration] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Logique du timer : incrémente en mode exercice, décrémente en mode repos
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        if (timerMode === 'exercise') {
          setExerciseTimer(t => t + 1);
        } else {
          setRestTimer(t => {
            if (t <= 1) {
              setTimerRunning(false);
              setTimerMode('exercise');
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerMode]);

  const startExerciseTimer = useCallback(() => {
    setTimerMode('exercise');
    setExerciseTimer(0);
    setTimerRunning(true);
  }, []);

  const startRestTimer = useCallback((duration?: number) => {
    const dur = duration ?? restDuration;
    setTimerMode('rest');
    setRestTimer(dur);
    setTimerRunning(true);
  }, [restDuration]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    setExerciseTimer(0);
    setRestTimer(0);
  }, []);

  return {
    exerciseTimer,
    restTimer,
    timerRunning,
    timerMode,
    restDuration,
    setRestDuration,
    startExerciseTimer,
    startRestTimer,
    pauseTimer,
    stopTimer,
  };
}
