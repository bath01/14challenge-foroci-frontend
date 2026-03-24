/**
 * Calendrier mensuel d'entraînement
 * Jours cliquables pour planifier des séances
 * Affiche les jours effectués (vert), planifiés (orange) et aujourd'hui
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  CARD, BORDER, SURFACE,
  CI_ORANGE, CI_GREEN, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../../constants/theme';
import {
  ScheduleEntry, loadSchedule, addToSchedule,
  removeFromSchedule, getScheduledDays,
} from '../../services/schedule';
import ScheduleModal from './ScheduleModal';

// Labels des jours de la semaine
const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

interface CalendarProps {
  /** Jours avec séances effectuées (données API) */
  workoutDays?: any;
}

export default function Calendar({ workoutDays }: CalendarProps) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Charger le planning local au montage
  useEffect(() => {
    loadSchedule().then(setSchedule);
  }, []);

  // Jours planifiés du mois courant
  const scheduledDays = getScheduledDays(schedule, year, month);

  // Nombre de jours dans le mois courant
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Décalage du premier jour (lundi = 0)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const firstDayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Extraire les numéros de jours effectués depuis l'API
  function extractDays(data: any): number[] {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map((entry: any) => {
        if (typeof entry === 'number') return entry;
        const dateStr = entry.date || entry;
        if (typeof dateStr === 'string') {
          return parseInt(dateStr.split('-').pop() || dateStr.split('/').pop() || '0', 10);
        }
        return 0;
      }).filter((d: number) => d > 0);
    }
    if (typeof data === 'object') {
      return Object.keys(data).map((key: string) => {
        return parseInt(key.split('-').pop() || '0', 10);
      }).filter((d: number) => d > 0);
    }
    return [];
  }

  const completedDays = extractDays(workoutDays);

  // Génère les cellules
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  /** Formatter la date pour le stockage */
  function formatDate(day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  /** Formatter la date pour l'affichage */
  function formatDisplayDate(day: number): string {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }

  /** Ouvrir le modal de planification */
  function handleDayPress(day: number) {
    setSelectedDay(day);
    setModalVisible(true);
  }

  /** Planifier une séance */
  async function handleSchedule(entry: ScheduleEntry) {
    const updated = await addToSchedule(entry);
    setSchedule(updated);
    setModalVisible(false);
  }

  /** Supprimer du planning */
  async function handleRemove() {
    if (selectedDay) {
      const updated = await removeFromSchedule(formatDate(selectedDay));
      setSchedule(updated);
    }
    setModalVisible(false);
  }

  // Entrée existante pour le jour sélectionné
  const selectedEntry = selectedDay
    ? schedule.find(e => e.date === formatDate(selectedDay)) || null
    : null;

  // Stats
  const workoutCount = completedDays.length;
  const scheduledCount = scheduledDays.length;

  return (
    <View>
      {/* En-tête jours de la semaine */}
      <View style={styles.headerRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.headerCell}>
            <Text style={[styles.headerText, (i === 5 || i === 6) && styles.headerWeekend]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.separator} />

      {/* Grille des jours */}
      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={i} style={styles.emptyCell} />;

          const isWorkout = completedDays.includes(day);
          const isScheduled = scheduledDays.includes(day);
          const isToday = day === today;
          const isFuture = day > today;
          const dayOfWeek = (firstDayOffset + day - 1) % 7;
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

          return (
            <TouchableOpacity
              key={i}
              style={styles.dayCellOuter}
              onPress={() => handleDayPress(day)}
              activeOpacity={0.6}
            >
              <View
                style={[
                  styles.dayCell,
                  isToday && styles.todayCell,
                  !isToday && isWorkout && styles.workoutCell,
                  !isToday && !isWorkout && isScheduled && styles.scheduledCell,
                  isFuture && !isToday && !isWorkout && !isScheduled && styles.futureCell,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    !isToday && isWorkout && styles.workoutText,
                    !isToday && !isWorkout && isScheduled && styles.scheduledText,
                    isFuture && !isToday && !isWorkout && !isScheduled && styles.futureText,
                    isWeekend && !isToday && !isWorkout && !isScheduled && styles.weekendText,
                  ]}
                >
                  {day}
                </Text>

                {/* Indicateurs */}
                {isWorkout && !isToday && <View style={styles.workoutDot} />}
                {isScheduled && !isWorkout && !isToday && <View style={styles.scheduledDot} />}
                {isToday && <View style={styles.todayDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Légende */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={styles.todayLegend} />
          <Text style={styles.legendText}>Aujourd'hui</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.workoutLegend} />
          <Text style={styles.legendText}>Effectué</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.scheduledLegend} />
          <Text style={styles.legendText}>Planifié</Text>
        </View>
        {(workoutCount > 0 || scheduledCount > 0) && (
          <View style={styles.legendBadge}>
            <Ionicons name="flame" size={10} color={CI_ORANGE} />
            <Text style={styles.legendBadgeText}>{workoutCount + scheduledCount}</Text>
          </View>
        )}
      </View>

      {/* Modal de planification */}
      {selectedDay && (
        <ScheduleModal
          visible={modalVisible}
          date={formatDate(selectedDay)}
          displayDate={formatDisplayDate(selectedDay)}
          existingEntry={selectedEntry}
          onSchedule={handleSchedule}
          onRemove={handleRemove}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  headerText: {
    fontSize: 10,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerWeekend: {
    color: `${TEXT_DIM}80`,
  },
  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 6,
    marginHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyCell: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCellOuter: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  todayCell: {
    backgroundColor: CI_ORANGE,
    shadowColor: CI_ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  workoutCell: {
    backgroundColor: `${CI_GREEN}15`,
    borderWidth: 1.5,
    borderColor: `${CI_GREEN}35`,
  },
  scheduledCell: {
    backgroundColor: `${CI_ORANGE}10`,
    borderWidth: 1,
    borderColor: `${CI_ORANGE}25`,
    borderStyle: 'dashed',
  },
  futureCell: {
    opacity: 0.4,
  },
  dayText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY,
    color: TEXT_SECONDARY,
  },
  todayText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY_EXTRABOLD,
    fontSize: 13,
  },
  workoutText: {
    color: CI_GREEN,
    fontFamily: FONT_FAMILY_BOLD,
  },
  scheduledText: {
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  futureText: {
    color: TEXT_DIM,
  },
  weekendText: {
    color: `${TEXT_SECONDARY}80`,
  },
  workoutDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: CI_GREEN, position: 'absolute', bottom: 4,
  },
  scheduledDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: CI_ORANGE, position: 'absolute', bottom: 4,
  },
  todayDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: '#FFF', position: 'absolute', bottom: 4,
  },

  // Légende
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  todayLegend: {
    width: 10, height: 10, borderRadius: 3,
    backgroundColor: CI_ORANGE,
  },
  workoutLegend: {
    width: 10, height: 10, borderRadius: 3,
    backgroundColor: `${CI_GREEN}15`,
    borderWidth: 1.5, borderColor: `${CI_GREEN}35`,
  },
  scheduledLegend: {
    width: 10, height: 10, borderRadius: 3,
    backgroundColor: `${CI_ORANGE}10`,
    borderWidth: 1, borderColor: `${CI_ORANGE}25`,
  },
  legendText: {
    fontSize: 9,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  legendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
    backgroundColor: `${CI_ORANGE}10`,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  legendBadgeText: {
    fontSize: 10,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_BOLD,
  },
});
