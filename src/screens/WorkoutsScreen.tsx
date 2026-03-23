/**
 * Écran Historique des séances
 * Liste les séances passées avec vue détaillée au tap
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, CI_ORANGE, CI_GREEN, CALORIES_RED,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { workoutHistory, getExerciseById } from '../data/mockData';
import ExerciseIcon from '../components/ui/ExerciseIcon';
import { Workout } from '../types';
import { formatTimer } from '../utils/formatters';

export default function WorkoutsScreen() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Vue détaillée d'une séance
  if (selectedWorkout) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setSelectedWorkout(null)}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Séance du {selectedWorkout.date}</Text>

          <View style={styles.detailStats}>
            <View style={styles.detailStatRow}>
              <Ionicons name="timer-outline" size={14} color={CI_ORANGE} />
              <Text style={styles.detailStatOrange}> {selectedWorkout.totalDuration} min</Text>
            </View>
            <View style={styles.detailStatRow}>
              <Ionicons name="flame-outline" size={14} color={CALORIES_RED} />
              <Text style={styles.detailStatRed}> {selectedWorkout.caloriesBurned} cal</Text>
            </View>
          </View>

          {selectedWorkout.exercises.map((ex, i) => {
            const exInfo = getExerciseById(ex.exerciseId);
            if (!exInfo) return null;

            return (
              <View key={i} style={[styles.detailExercise, i > 0 && styles.borderTop]}>
                <View style={styles.detailExerciseHeader}>
                  <ExerciseIcon name={exInfo.icon} size={22} color={CI_ORANGE} />
                  <View>
                    <Text style={styles.detailExerciseName}>{exInfo.name}</Text>
                    <Text style={styles.detailExerciseMuscle}>{exInfo.muscleGroup}</Text>
                  </View>
                </View>
                {ex.sets.map((set, j) => (
                  <View key={j} style={styles.setRow}>
                    <Text style={styles.setLabel}>Set {j + 1}</Text>
                    <Text style={styles.setValue}>
                      {set.duration ? formatTimer(set.duration) : `${set.reps} reps`}
                      {set.weight > 0 ? ` — ${set.weight} kg` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}

          {selectedWorkout.notes ? (
            <Text style={styles.detailNotes}>"{selectedWorkout.notes}"</Text>
          ) : null}
        </View>
      </ScrollView>
    );
  }

  // Liste des séances
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Historique</Text>
      <Text style={styles.subtitle}>{workoutHistory.length} séances enregistrées</Text>

      <View style={styles.list}>
        {workoutHistory.map(workout => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutCard}
            onPress={() => setSelectedWorkout(workout)}
            activeOpacity={0.7}
          >
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutDate}>{workout.date}</Text>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{workout.totalDuration} min</Text>
              </View>
            </View>

            <View style={styles.exerciseTags}>
              {workout.exercises.map((ex, i) => {
                const exInfo = getExerciseById(ex.exerciseId);
                return (
                  <View key={i} style={styles.exerciseTag}>
                    <Text style={styles.exerciseTagText}>
                      <ExerciseIcon name={exInfo?.icon ?? 'fitness'} size={12} color={CI_GREEN} /> {exInfo?.name}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.workoutFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="flame-outline" size={12} color={TEXT_SECONDARY} />
                <Text style={styles.footerText}> {workout.caloriesBurned} cal</Text>
              </View>
              <Text style={styles.footerText}>
                {workout.exercises.length} exercice{workout.exercises.length > 1 ? 's' : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
  },
  durationBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: `${CI_ORANGE}15`,
  },
  durationText: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  exerciseTags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  exerciseTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: `${CI_GREEN}12`,
  },
  exerciseTagText: {
    fontSize: FONT_SIZE.sm,
    color: CI_GREEN,
    fontFamily: FONT_FAMILY,
  },
  workoutFooter: {
    flexDirection: 'row',
    gap: 16,
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
    gap: 8,
    marginBottom: 8,
  },
  detailExerciseName: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
  },
  detailExerciseMuscle: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  setRow: {
    flexDirection: 'row',
    gap: 12,
    paddingLeft: 36,
    marginBottom: 4,
  },
  setLabel: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    width: 40,
  },
  setValue: {
    fontSize: FONT_SIZE.body,
    color: TEXT_PRIMARY,
    fontFamily: FONT_FAMILY,
  },
  detailNotes: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontStyle: 'italic',
    fontFamily: FONT_FAMILY,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
    marginTop: 12,
  },
});
