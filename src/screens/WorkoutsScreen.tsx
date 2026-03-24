/**
 * Écran Historique des séances
 * Liste les séances depuis l'API avec vue détaillée au tap
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, CI_ORANGE, CI_GREEN, CALORIES_RED,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { apiGet, ENDPOINTS } from '../services/api';
import { useApi } from '../hooks/useApi';
import ScreenLoader from '../components/ui/ScreenLoader';
import ScreenError from '../components/ui/ScreenError';

/** Icône selon la catégorie d'exercice */
function categoryIcon(category: string): string {
  const map: Record<string, string> = {
    CHEST: 'fitness',
    BACK: 'barbell',
    LEGS: 'footsteps',
    SHOULDERS: 'body',
    ARMS: 'barbell',
    ABS: 'flame',
    CARDIO: 'flash',
    FULL_BODY: 'body',
  };
  return map[category] || 'barbell-outline';
}

export default function WorkoutsScreen() {
  const navigation = useNavigation<any>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Chargement des séances depuis l'API
  const fetchWorkouts = useCallback(() => apiGet<any[]>(ENDPOINTS.WORKOUTS), []);
  const { data: workouts, isLoading, error, refresh } = useApi(fetchWorkouts);

  // Chargement du détail d'une séance (avec ses exercices)
  const fetchDetail = useCallback(
    () => selectedId ? apiGet<any>(`/workouts/${selectedId}`) : Promise.resolve(null),
    [selectedId],
  );
  const { data: workoutDetail, isLoading: loadingDetail } = useApi(fetchDetail, !!selectedId);

  const [refreshing, setRefreshing] = React.useState(false);
  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  if (isLoading && !refreshing) return <ScreenLoader />;
  if (error) return <ScreenError message={error} onRetry={refresh} />;

  const workoutList = workouts || [];

  // Vue détaillée d'une séance
  if (selectedId) {
    if (loadingDetail || !workoutDetail) return <ScreenLoader message="Chargement de la séance..." />;

    const detail = workoutDetail;
    const exercises = detail.exercises || [];
    const totalCalories = exercises.reduce((sum: number, ex: any) => sum + (ex.calories || 0), 0);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setSelectedId(null)}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{detail.name}</Text>
          {detail.description ? (
            <Text style={styles.detailDescription}>{detail.description}</Text>
          ) : null}

          <View style={styles.detailStats}>
            <View style={styles.detailStatRow}>
              <Ionicons name="barbell-outline" size={14} color={CI_ORANGE} />
              <Text style={styles.detailStatOrange}> {exercises.length} exercices</Text>
            </View>
            <View style={styles.detailStatRow}>
              <Ionicons name="flame-outline" size={14} color={CALORIES_RED} />
              <Text style={styles.detailStatRed}> {totalCalories} cal</Text>
            </View>
          </View>

          {exercises.map((ex: any, i: number) => {
            const exData = ex.exercise || {};
            return (
              <View key={ex.id || i} style={[styles.detailExercise, i > 0 && styles.borderTop]}>
                <View style={styles.detailExerciseHeader}>
                  <Ionicons name={categoryIcon(exData.category) as any} size={22} color={CI_ORANGE} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailExerciseName}>{exData.name || 'Exercice'}</Text>
                    <Text style={styles.detailExerciseMuscle}>{exData.category || ''}</Text>
                  </View>
                </View>
                <View style={styles.metricsRow}>
                  {ex.sets ? (
                    <View style={styles.metricBadge}>
                      <Text style={styles.metricText}>{ex.sets} séries</Text>
                    </View>
                  ) : null}
                  {ex.reps ? (
                    <View style={styles.metricBadge}>
                      <Text style={styles.metricText}>{ex.reps} reps</Text>
                    </View>
                  ) : null}
                  {ex.duration ? (
                    <View style={styles.metricBadge}>
                      <Text style={styles.metricText}>{ex.duration}s</Text>
                    </View>
                  ) : null}
                  {ex.calories ? (
                    <View style={[styles.metricBadge, { backgroundColor: `${CALORIES_RED}12` }]}>
                      <Text style={[styles.metricText, { color: CALORIES_RED }]}>{ex.calories} cal</Text>
                    </View>
                  ) : null}
                </View>
                {exData.description ? (
                  <Text style={styles.exerciseDesc}>{exData.description}</Text>
                ) : null}
              </View>
            );
          })}

          {/* Bouton démarrer la séance */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              setSelectedId(null);
              navigation.navigate('WorkoutSession', {
                workoutId: detail.id,
                workoutName: detail.name,
              });
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={18} color="#FFF" />
            <Text style={styles.startButtonText}>Démarrer cette séance</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Liste des séances
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={CI_ORANGE} />}
    >
      <Text style={styles.title}>Historique</Text>
      <Text style={styles.subtitle}>{workoutList.length} séances enregistrées</Text>

      <View style={styles.list}>
        {workoutList.map((workout: any) => {
          const exerciseCount = workout._count?.exercises || 0;
          return (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => setSelectedId(workout.id)}
              activeOpacity={0.7}
            >
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{exerciseCount} exo</Text>
                </View>
              </View>

              {workout.description ? (
                <Text style={styles.workoutDescription} numberOfLines={2}>{workout.description}</Text>
              ) : null}

              <View style={styles.workoutFooter}>
                <View style={styles.footerItem}>
                  <Ionicons name="barbell-outline" size={12} color={TEXT_SECONDARY} />
                  <Text style={styles.footerText}> {exerciseCount} exercice{exerciseCount > 1 ? 's' : ''}</Text>
                </View>
                <Text style={styles.footerDate}>
                  {new Date(workout.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  title: {
    fontSize: FONT_SIZE.hero,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: SPACING.xl,
  },
  list: {
    gap: 10,
  },
  workoutCard: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.lg,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  workoutName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
    flex: 1,
    marginRight: 8,
  },
  countBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: `${CI_ORANGE}15`,
  },
  countText: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  workoutDescription: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 8,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  footerDate: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
  },

  // Vue détaillée
  backButton: {
    color: CI_ORANGE,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    marginBottom: SPACING.lg,
  },
  detailCard: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.xl,
  },
  detailTitle: {
    fontSize: FONT_SIZE.h2,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 12,
  },
  detailStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailStatOrange: {
    fontSize: FONT_SIZE.body,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  detailStatRed: {
    fontSize: FONT_SIZE.body,
    color: CALORIES_RED,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  detailExercise: {
    paddingVertical: 12,
  },
  detailExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailExerciseName: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
  },
  detailExerciseMuscle: {
    fontSize: FONT_SIZE.xs,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  metricBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: `${CI_GREEN}12`,
  },
  metricText: {
    fontSize: FONT_SIZE.sm,
    color: CI_GREEN,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  exerciseDesc: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    fontStyle: 'italic',
    marginTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: CI_ORANGE,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    marginTop: SPACING.lg,
  },
  startButtonText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY_BOLD,
    color: '#FFF',
  },
});
