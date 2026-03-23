/**
 * Écran d'accueil - Tableau de bord principal
 * Affiche les statistiques, le calendrier, la progression du poids et la dernière séance
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, CI_ORANGE, CI_GREEN, CALORIES_RED,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { workoutHistory, weightHistory, calendarWorkoutDays, getExerciseById } from '../data/mockData';
import StatCard from '../components/ui/StatCard';
import ExerciseIcon from '../components/ui/ExerciseIcon';
import MiniBarChart from '../components/ui/MiniBarChart';
import Calendar from '../components/home/Calendar';

export default function HomeScreen() {
  // Calcul des statistiques globales
  const totalSeances = workoutHistory.length;
  const totalCalories = workoutHistory.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const streak = 5; // Jours consécutifs

  const lastWorkout = workoutHistory[0];
  const currentWeight = weightHistory[weightHistory.length - 1];

  // Données du graphique de poids
  const weightChartData = weightHistory.map(w => ({
    value: w.value,
    label: w.date.split('/')[0],
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* En-tête de bienvenue */}
      <View style={styles.header}>
        <Text style={styles.brandName}>ForoCI</Text>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Salut champion ! </Text>
          <Ionicons name="fitness" size={24} color={CI_ORANGE} />
        </View>
        <Text style={styles.subtitle}>Ta force, c'est ta discipline</Text>
      </View>

      {/* Cartes de statistiques résumé */}
      <View style={styles.statsRow}>
        <StatCard iconName="barbell-outline" value={totalSeances} label="Séances" color={CI_ORANGE} />
        <StatCard iconName="flame-outline" value={totalCalories} label="Calories" color={CALORIES_RED} />
        <StatCard iconName="flash-outline" value={`${streak}j`} label="Streak" color={CI_GREEN} />
      </View>

      {/* Calendrier du mois */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Mars 2026</Text>
          <Text style={styles.cardBadge}>{calendarWorkoutDays.length} séances</Text>
        </View>
        <Calendar />
      </View>

      {/* Progression du poids corporel */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Poids corporel</Text>
            <Text style={styles.cardSubtitle}>Dernière semaine</Text>
          </View>
          <View style={styles.weightRight}>
            <Text style={styles.weightValue}>{currentWeight.value} kg</Text>
            <Text style={styles.weightDelta}>-1.2 kg</Text>
          </View>
        </View>
        <MiniBarChart data={weightChartData} height={50} color={CI_GREEN} />
      </View>

      {/* Dernière séance */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Dernière séance</Text>
        <View style={styles.lastWorkoutHeader}>
          <Text style={styles.lastWorkoutDate}>{lastWorkout.date}</Text>
          <Text style={styles.lastWorkoutDuration}>{lastWorkout.totalDuration} min</Text>
        </View>
        {lastWorkout.exercises.map((ex, i) => {
          const exInfo = getExerciseById(ex.exerciseId);
          if (!exInfo) return null;

          return (
            <View
              key={i}
              style={[styles.exerciseRow, i > 0 && styles.exerciseRowBorder]}
            >
              <ExerciseIcon name={exInfo.icon} size={22} color={CI_ORANGE} />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exInfo.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {ex.sets.length} série{ex.sets.length > 1 ? 's' : ''} — {ex.sets.map(s => s.reps).join(' / ')} reps
                </Text>
              </View>
              <Text style={styles.exerciseMuscle}>{exInfo.muscleGroup}</Text>
            </View>
          );
        })}
        {lastWorkout.notes ? (
          <Text style={styles.notes}>"{lastWorkout.notes}"</Text>
        ) : null}
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
  header: {
    marginBottom: SPACING.xl,
  },
  brandName: {
    fontSize: FONT_SIZE.md,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_BOLD,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: FONT_SIZE.display,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  cardBadge: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  weightRight: {
    alignItems: 'flex-end',
  },
  weightValue: {
    fontSize: FONT_SIZE.h1,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: CI_GREEN,
    marginBottom: 2,
  },
  weightDelta: {
    fontSize: FONT_SIZE.sm,
    color: CI_GREEN,
    fontFamily: FONT_FAMILY,
  },
  lastWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  lastWorkoutDate: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  lastWorkoutDuration: {
    fontSize: FONT_SIZE.body,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  exerciseRowBorder: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: TEXT_PRIMARY,
  },
  exerciseDetail: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  exerciseMuscle: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
  },
  notes: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontStyle: 'italic',
    fontFamily: FONT_FAMILY,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
    marginTop: 8,
  },
});
