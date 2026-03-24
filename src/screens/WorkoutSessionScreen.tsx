/**
 * Écran de séance active
 * Guide l'utilisateur exercice par exercice avec timer intégré
 * Flux : Exercice → Timer → Repos → Exercice suivant → ... → Fin
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, SURFACE, CI_ORANGE, CI_GREEN, CALORIES_RED,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { apiGet } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useTimer } from '../hooks/useTimer';
import { formatTimer } from '../utils/formatters';
import ScreenLoader from '../components/ui/ScreenLoader';

// Dimensions du cercle SVG
const CIRCLE_SIZE = 200;
const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

// Presets de repos
const REST_PRESETS = [30, 45, 60, 90];

/** Phases de la séance */
type SessionPhase = 'ready' | 'exercise' | 'rest' | 'done';

interface WorkoutSessionScreenProps {
  route: any;
  navigation: any;
}

/** Icône selon la catégorie d'exercice */
function categoryIcon(category: string): string {
  const map: Record<string, string> = {
    CHEST: 'fitness', BACK: 'barbell', LEGS: 'footsteps',
    SHOULDERS: 'body', ARMS: 'barbell', ABS: 'flame',
    CARDIO: 'flash', FULL_BODY: 'body',
  };
  return map[category] || 'barbell-outline';
}

export default function WorkoutSessionScreen({ route, navigation }: WorkoutSessionScreenProps) {
  const { workoutId, workoutName } = route.params;

  // Chargement du détail de la séance
  const fetchDetail = useCallback(() => apiGet<any>(`/workouts/${workoutId}`), [workoutId]);
  const { data: workout, isLoading } = useApi(fetchDetail);

  // État de la séance
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>('ready');
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  // Timer
  const {
    exerciseTimer, restTimer, timerRunning, timerMode,
    restDuration, setRestDuration,
    startExerciseTimer, startRestTimer, pauseTimer, stopTimer,
  } = useTimer();

  const exercises = workout?.exercises || [];
  const currentExercise = exercises[currentIndex];
  const totalExercises = exercises.length;
  const isLastExercise = currentIndex >= totalExercises - 1;

  // Initialiser les sets complétés
  useEffect(() => {
    if (exercises.length > 0 && completedSets.length === 0) {
      setCompletedSets(new Array(exercises.length).fill(0));
    }
  }, [exercises.length]);

  // Calcul de la progression du cercle
  const progressOffset = (() => {
    if (phase === 'rest' && restTimer > 0) {
      return CIRCLE_CIRCUMFERENCE * (1 - restTimer / restDuration);
    }
    if (phase === 'exercise' && currentExercise?.duration) {
      const elapsed = exerciseTimer;
      const total = currentExercise.duration;
      return CIRCLE_CIRCUMFERENCE * Math.min(elapsed / total, 1);
    }
    return 0;
  })();

  // Auto-passer au repos quand le timer d'exercice atteint la durée cible
  useEffect(() => {
    if (phase === 'exercise' && currentExercise?.duration && exerciseTimer >= currentExercise.duration) {
      handleFinishExercise();
    }
  }, [exerciseTimer, phase]);

  // Auto-passer à l'exercice suivant quand le repos est terminé
  useEffect(() => {
    if (phase === 'rest' && !timerRunning && restTimer === 0) {
      handleNextStep();
    }
  }, [phase, timerRunning, restTimer]);

  /** Démarrer la séance */
  function handleStart() {
    setPhase('exercise');
    startExerciseTimer();
  }

  /** Terminer l'exercice courant → passer en repos */
  function handleFinishExercise() {
    stopTimer();
    // Incrémenter les sets complétés
    setCompletedSets(prev => {
      const updated = [...prev];
      updated[currentIndex] = Math.min((updated[currentIndex] || 0) + 1, currentExercise?.sets || 1);
      return updated;
    });

    const setsCompleted = (completedSets[currentIndex] || 0) + 1;
    const totalSets = currentExercise?.sets || 1;

    if (setsCompleted < totalSets) {
      // Encore des séries à faire → repos entre séries
      setPhase('rest');
      startRestTimer();
    } else if (!isLastExercise) {
      // Toutes les séries faites → repos avant exercice suivant
      setPhase('rest');
      startRestTimer();
    } else {
      // Dernière série du dernier exercice → terminé
      setPhase('done');
    }
  }

  /** Passer au prochain step (après repos ou skip repos) */
  function handleNextStep() {
    stopTimer();

    // Vérifier si on a encore des séries sur l'exercice courant
    const setsDone = (completedSets[currentIndex] || 0);
    const totalSets = currentExercise?.sets || 1;

    if (setsDone < totalSets) {
      // Encore des séries → relancer l'exercice courant
      setPhase('exercise');
      startExerciseTimer();
    } else if (!isLastExercise) {
      // Passer à l'exercice suivant
      setCurrentIndex(prev => prev + 1);
      setPhase('exercise');
      startExerciseTimer();
    } else {
      setPhase('done');
    }
  }

  /** Quitter la séance */
  function handleQuit() {
    Alert.alert('Quitter la séance ?', 'Ta progression ne sera pas sauvegardée.', [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Quitter', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  }

  if (isLoading || !workout) {
    return <ScreenLoader message="Préparation de la séance..." />;
  }

  // --- Écran de fin ---
  if (phase === 'done') {
    const totalCalories = exercises.reduce((sum: number, ex: any) => sum + (ex.calories || 0), 0);
    return (
      <View style={styles.container}>
        <View style={styles.doneContent}>
          <View style={styles.doneIconCircle}>
            <Ionicons name="trophy" size={48} color={CI_ORANGE} />
          </View>
          <Text style={styles.doneTitle}>Séance terminée !</Text>
          <Text style={styles.doneSubtitle}>{workoutName}</Text>

          <View style={styles.doneSummary}>
            <View style={styles.doneStat}>
              <Text style={styles.doneStatValue}>{totalExercises}</Text>
              <Text style={styles.doneStatLabel}>Exercices</Text>
            </View>
            <View style={[styles.doneStat, styles.doneStatBorder]}>
              <Text style={[styles.doneStatValue, { color: CALORIES_RED }]}>{totalCalories}</Text>
              <Text style={styles.doneStatLabel}>Calories</Text>
            </View>
            <View style={styles.doneStat}>
              <Text style={[styles.doneStatValue, { color: CI_GREEN }]}>{formatTimer(exerciseTimer)}</Text>
              <Text style={styles.doneStatLabel}>Durée</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.doneButtonText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const exData = currentExercise?.exercise || {};
  const circleColor = phase === 'rest' ? CI_GREEN : CI_ORANGE;
  const setsCompleted = completedSets[currentIndex] || 0;
  const totalSets = currentExercise?.sets || 1;

  return (
    <View style={styles.container}>
      {/* Header avec progression */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit}>
          <Ionicons name="close" size={24} color={TEXT_SECONDARY} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{workoutName}</Text>
          <Text style={styles.headerProgress}>{currentIndex + 1} / {totalExercises}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Barre de progression */}
      <View style={styles.progressBar}>
        {exercises.map((_: any, i: number) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < currentIndex && styles.progressDotDone,
              i === currentIndex && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Phase Ready */}
        {phase === 'ready' && (
          <View style={styles.readyContent}>
            <View style={styles.readyCard}>
              <Ionicons name={categoryIcon(exData.category) as any} size={36} color={CI_ORANGE} />
              <Text style={styles.readyTitle}>{workout.name}</Text>
              <Text style={styles.readySubtitle}>{totalExercises} exercices</Text>
              {workout.description ? (
                <Text style={styles.readyDesc}>{workout.description}</Text>
              ) : null}
            </View>

            {/* Aperçu des exercices */}
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Exercices</Text>
              {exercises.map((ex: any, i: number) => {
                const info = ex.exercise || {};
                return (
                  <View key={ex.id || i} style={[styles.previewRow, i > 0 && styles.previewBorder]}>
                    <Text style={styles.previewIndex}>{i + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.previewName}>{info.name || 'Exercice'}</Text>
                      <Text style={styles.previewMeta}>
                        {ex.sets} séries{ex.reps ? ` × ${ex.reps} reps` : ''}{ex.duration ? ` × ${ex.duration}s` : ''}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
              <Ionicons name="play" size={20} color="#FFF" />
              <Text style={styles.startButtonText}>Démarrer la séance</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Phase Exercice / Repos */}
        {(phase === 'exercise' || phase === 'rest') && (
          <View style={styles.activeContent}>
            {/* Cercle timer */}
            <View style={styles.timerContainer}>
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
                <Circle
                  cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_RADIUS}
                  fill="none" stroke={BORDER} strokeWidth={4}
                />
                {(phase === 'rest' || (phase === 'exercise' && currentExercise?.duration)) && (
                  <Circle
                    cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_RADIUS}
                    fill="none" stroke={circleColor} strokeWidth={5}
                    strokeDasharray={CIRCLE_CIRCUMFERENCE}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    rotation={-90}
                    origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                  />
                )}
              </Svg>
              <View style={styles.timerOverlay}>
                <Text style={[styles.timerLabel, { color: circleColor }]}>
                  {phase === 'exercise' ? 'Exercice' : 'Repos'}
                </Text>
                <Text style={styles.timerValue}>
                  {phase === 'exercise' ? formatTimer(exerciseTimer) : formatTimer(restTimer)}
                </Text>
                <Text style={styles.timerSets}>
                  {phase === 'exercise'
                    ? `Série ${setsCompleted + 1} / ${totalSets}`
                    : 'Récupération'}
                </Text>
              </View>
            </View>

            {/* Info exercice courant */}
            <View style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Ionicons name={categoryIcon(exData.category) as any} size={24} color={CI_ORANGE} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseName}>{exData.name || 'Exercice'}</Text>
                  <Text style={styles.exerciseCategory}>{exData.category || ''}</Text>
                </View>
              </View>

              {/* Métriques */}
              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{currentExercise?.sets || '-'}</Text>
                  <Text style={styles.metricLabel}>Séries</Text>
                </View>
                {currentExercise?.reps && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{currentExercise.reps}</Text>
                    <Text style={styles.metricLabel}>Reps</Text>
                  </View>
                )}
                {currentExercise?.duration && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{currentExercise.duration}s</Text>
                    <Text style={styles.metricLabel}>Durée</Text>
                  </View>
                )}
                {currentExercise?.calories && (
                  <View style={styles.metricItem}>
                    <Text style={[styles.metricValue, { color: CALORIES_RED }]}>{currentExercise.calories}</Text>
                    <Text style={styles.metricLabel}>Cal</Text>
                  </View>
                )}
              </View>

              {exData.description ? (
                <Text style={styles.exerciseDesc}>{exData.description}</Text>
              ) : null}
            </View>

            {/* Boutons de contrôle */}
            {phase === 'exercise' && (
              <View style={styles.controls}>
                {timerRunning ? (
                  <>
                    <TouchableOpacity style={styles.btnOutline} onPress={pauseTimer} activeOpacity={0.8}>
                      <Ionicons name="pause" size={18} color={CI_ORANGE} />
                      <Text style={styles.btnOutlineText}>Pause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleFinishExercise} activeOpacity={0.8}>
                      <Ionicons name="checkmark" size={18} color="#FFF" />
                      <Text style={styles.btnPrimaryText}>Série terminée</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.btnPrimary} onPress={startExerciseTimer} activeOpacity={0.8}>
                      <Ionicons name="play" size={18} color="#FFF" />
                      <Text style={styles.btnPrimaryText}>Reprendre</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            {phase === 'rest' && (
              <View style={styles.controls}>
                {/* Presets repos */}
                <View style={styles.restPresets}>
                  {REST_PRESETS.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.presetBtn, restDuration === d && styles.presetBtnActive]}
                      onPress={() => { setRestDuration(d); startRestTimer(d); }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.presetText, restDuration === d && styles.presetTextActive]}>{d}s</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.btnSkip} onPress={handleNextStep} activeOpacity={0.8}>
                  <Ionicons name="play-skip-forward" size={16} color={CI_GREEN} />
                  <Text style={styles.btnSkipText}>Passer le repos</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.md,
  },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY_BOLD, color: TEXT_PRIMARY },
  headerProgress: { fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY, color: TEXT_DIM },
  progressBar: {
    flexDirection: 'row', gap: 4, paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg,
  },
  progressDot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: BORDER },
  progressDotDone: { backgroundColor: CI_GREEN },
  progressDotActive: { backgroundColor: CI_ORANGE },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },

  // Ready
  readyContent: { gap: SPACING.lg },
  readyCard: {
    backgroundColor: CARD, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, borderColor: BORDER,
    padding: SPACING.xl, alignItems: 'center', gap: 8,
  },
  readyTitle: { fontSize: FONT_SIZE.h1, fontFamily: FONT_FAMILY_EXTRABOLD, color: TEXT_PRIMARY },
  readySubtitle: { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY, color: CI_ORANGE },
  readyDesc: {
    fontSize: FONT_SIZE.body, fontFamily: FONT_FAMILY, color: TEXT_SECONDARY,
    textAlign: 'center', marginTop: 4,
  },
  previewCard: {
    backgroundColor: CARD, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, borderColor: BORDER,
    padding: SPACING.lg,
  },
  previewTitle: {
    fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY_BOLD, color: TEXT_DIM,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  previewBorder: { borderTopWidth: 1, borderTopColor: BORDER },
  previewIndex: {
    width: 24, height: 24, borderRadius: 8, backgroundColor: `${CI_ORANGE}12`,
    textAlign: 'center', lineHeight: 24, fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY_BOLD, color: CI_ORANGE,
  },
  previewName: { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY_SEMIBOLD, color: TEXT_PRIMARY },
  previewMeta: { fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY, color: TEXT_DIM },
  startButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: CI_ORANGE, borderRadius: BORDER_RADIUS.lg, paddingVertical: 14,
  },
  startButtonText: { fontSize: FONT_SIZE.xl, fontFamily: FONT_FAMILY_BOLD, color: '#FFF' },

  // Active
  activeContent: { alignItems: 'center', gap: SPACING.lg },
  timerContainer: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, position: 'relative' },
  timerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  timerLabel: {
    fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY_BOLD,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4,
  },
  timerValue: {
    fontSize: FONT_SIZE.timer, fontFamily: FONT_FAMILY, fontWeight: '200',
    color: TEXT_PRIMARY, letterSpacing: -2,
  },
  timerSets: { fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY, color: TEXT_SECONDARY, marginTop: 4 },

  // Exercice card
  exerciseCard: {
    backgroundColor: CARD, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, borderColor: BORDER,
    padding: SPACING.lg, width: '100%',
  },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  exerciseName: { fontSize: FONT_SIZE.title, fontFamily: FONT_FAMILY_BOLD, color: TEXT_PRIMARY },
  exerciseCategory: {
    fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY, color: TEXT_DIM,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  metricItem: {
    flex: 1, backgroundColor: SURFACE, borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10, alignItems: 'center', gap: 2,
  },
  metricValue: { fontSize: FONT_SIZE.h2, fontFamily: FONT_FAMILY_EXTRABOLD, color: CI_ORANGE },
  metricLabel: { fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY, color: TEXT_DIM },
  exerciseDesc: {
    fontSize: FONT_SIZE.sm, fontFamily: FONT_FAMILY, color: TEXT_SECONDARY,
    fontStyle: 'italic', marginTop: 4,
  },

  // Contrôles
  controls: { width: '100%', gap: 10, alignItems: 'center' },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: CI_ORANGE, borderRadius: BORDER_RADIUS.pill,
    paddingVertical: 14, paddingHorizontal: 32, width: '100%',
  },
  btnPrimaryText: { color: '#FFF', fontSize: FONT_SIZE.lg, fontFamily: FONT_FAMILY_BOLD },
  btnOutline: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: BORDER, borderRadius: BORDER_RADIUS.pill,
    paddingVertical: 12, paddingHorizontal: 24, width: '100%',
  },
  btnOutlineText: { color: CI_ORANGE, fontSize: FONT_SIZE.lg, fontFamily: FONT_FAMILY_SEMIBOLD },
  restPresets: { flexDirection: 'row', gap: 6 },
  presetBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: BORDER,
  },
  presetBtnActive: { backgroundColor: `${CI_GREEN}20`, borderColor: 'transparent' },
  presetText: { fontSize: FONT_SIZE.body, fontFamily: FONT_FAMILY, color: TEXT_SECONDARY },
  presetTextActive: { color: CI_GREEN },
  btnSkip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10,
  },
  btnSkipText: { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY_SEMIBOLD, color: CI_GREEN },

  // Done
  doneContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  doneIconCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: `${CI_ORANGE}12`,
    borderWidth: 2, borderColor: `${CI_ORANGE}25`, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  doneTitle: { fontSize: FONT_SIZE.h1, fontFamily: FONT_FAMILY_EXTRABOLD, color: TEXT_PRIMARY, marginBottom: 4 },
  doneSubtitle: { fontSize: FONT_SIZE.md, fontFamily: FONT_FAMILY, color: TEXT_SECONDARY, marginBottom: 24 },
  doneSummary: {
    flexDirection: 'row', backgroundColor: CARD, borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1, borderColor: BORDER, padding: SPACING.lg, width: '100%', marginBottom: 24,
  },
  doneStat: { flex: 1, alignItems: 'center', gap: 4 },
  doneStatBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: BORDER },
  doneStatValue: { fontSize: FONT_SIZE.h1, fontFamily: FONT_FAMILY_EXTRABOLD, color: CI_ORANGE },
  doneStatLabel: { fontSize: FONT_SIZE.xs, fontFamily: FONT_FAMILY, color: TEXT_DIM },
  doneButton: {
    backgroundColor: CI_ORANGE, borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14, paddingHorizontal: 40,
  },
  doneButtonText: { fontSize: FONT_SIZE.xl, fontFamily: FONT_FAMILY_BOLD, color: '#FFF' },
});
