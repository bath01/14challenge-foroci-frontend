/**
 * Calendrier mensuel d'entraînement
 * Affiche les jours effectués (vert) et planifiés (orange) du mois
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  CI_ORANGE, CI_GREEN, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_BOLD,
} from '../../constants/theme';
import { calendarWorkoutDays, calendarScheduledDays } from '../../data/mockData';

// Labels des jours de la semaine
const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Configuration du calendrier Mars 2026
const DAYS_IN_MONTH = 31;
const FIRST_DAY_OFFSET = 6; // 1er Mars 2026 = dimanche → décalage de 6
const TODAY = 21;

export default function Calendar() {
  // Génère les cellules : cases vides pour le décalage + jours du mois
  const cells: (number | null)[] = [];
  for (let i = 0; i < FIRST_DAY_OFFSET; i++) cells.push(null);
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push(d);

  return (
    <View>
      {/* En-tête des jours de la semaine */}
      <View style={styles.headerRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.headerCell}>
            <Text style={styles.headerText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Grille des jours */}
      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={i} style={styles.emptyCell} />;

          const isWorkout = calendarWorkoutDays.includes(day);
          const isScheduled = calendarScheduledDays.includes(day);
          const isToday = day === TODAY;

          return (
            <View
              key={i}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
                !isToday && isWorkout && styles.workoutCell,
                !isToday && !isWorkout && isScheduled && styles.scheduledCell,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  !isToday && isWorkout && styles.workoutText,
                  !isToday && !isWorkout && isScheduled && styles.scheduledText,
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Légende */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: `${CI_GREEN}40`, borderColor: `${CI_GREEN}60` }]} />
          <Text style={styles.legendText}>Effectué</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: `${CI_ORANGE}40`, borderColor: `${CI_ORANGE}60` }]} />
          <Text style={styles.legendText}>Planifié</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    padding: 4,
  },
  headerText: {
    fontSize: 9,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyCell: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  todayCell: {
    backgroundColor: CI_ORANGE,
    borderColor: 'transparent',
  },
  workoutCell: {
    backgroundColor: `${CI_GREEN}20`,
    borderColor: `${CI_GREEN}40`,
  },
  scheduledCell: {
    backgroundColor: `${CI_ORANGE}10`,
    borderColor: 'transparent',
  },
  dayText: {
    fontSize: 11,
    fontFamily: FONT_FAMILY,
    color: TEXT_SECONDARY,
  },
  todayText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY_BOLD,
  },
  workoutText: {
    color: CI_GREEN,
  },
  scheduledText: {
    color: CI_ORANGE,
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 3,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 9,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
});
