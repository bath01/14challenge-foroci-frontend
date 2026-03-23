/**
 * Écran Programmes d'entraînement
 * Liste les programmes disponibles avec vue détaillée du planning hebdomadaire
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {
  DARK_BG, CARD, BORDER, SURFACE, CI_ORANGE, CI_GREEN,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { programs } from '../data/mockData';
import { Program } from '../types';

// Labels abrégés des jours de la semaine
const DAY_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function ProgramsScreen() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Vue détaillée d'un programme
  if (selectedProgram) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setSelectedProgram(null)}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{selectedProgram.name}</Text>
          <Text style={styles.detailDuration}>{selectedProgram.duration} semaines</Text>

          {selectedProgram.days.map((day, i) => {
            const isRest = day === 'Repos';
            return (
              <View key={i} style={[styles.dayRow, i > 0 && styles.borderTop]}>
                <View style={[styles.dayBadge, { backgroundColor: isRest ? `${TEXT_DIM}15` : `${CI_ORANGE}15` }]}>
                  <Text style={[styles.dayBadgeText, { color: isRest ? TEXT_DIM : CI_ORANGE }]}>
                    {DAY_SHORT[i]}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.dayName, isRest && { color: TEXT_DIM }]}>{day}</Text>
                  <Text style={styles.dayLabel}>
                    {isRest ? 'Récupération' : `Jour ${i + 1}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // Liste des programmes
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Programmes</Text>
      <Text style={styles.subtitle}>Plans d'entraînement</Text>

      <View style={styles.list}>
        {programs.map(prog => (
          <TouchableOpacity
            key={prog.id}
            style={styles.programCard}
            onPress={() => setSelectedProgram(prog)}
            activeOpacity={0.7}
          >
            <Text style={styles.programName}>{prog.name}</Text>

            <View style={styles.programMeta}>
              <Text style={styles.programWeeks}>{prog.duration} semaines</Text>
              <Text style={styles.programDays}>7 jours/sem</Text>
            </View>

            {/* Mini-aperçu de la semaine */}
            <View style={styles.weekPreview}>
              {prog.days.map((d, i) => {
                const isRest = d === 'Repos';
                return (
                  <View
                    key={i}
                    style={[
                      styles.weekDay,
                      { backgroundColor: isRest ? `${TEXT_DIM}20` : `${CI_GREEN}15` },
                    ]}
                  >
                    <Text style={[styles.weekDayText, { color: isRest ? TEXT_DIM : CI_GREEN }]}>
                      {DAY_SHORT[i]}
                    </Text>
                  </View>
                );
              })}
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
    gap: 12,
  },
  programCard: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 4,
    borderLeftColor: CI_ORANGE,
    padding: SPACING.xl,
  },
  programName: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  programMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  programWeeks: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  programDays: {
    fontSize: FONT_SIZE.sm,
    color: CI_GREEN,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  weekPreview: {
    flexDirection: 'row',
    gap: 4,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 4,
  },
  weekDayText: {
    fontSize: 7,
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
    fontSize: FONT_SIZE.h1,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  detailDuration: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 20,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY_BOLD,
  },
  dayName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: TEXT_PRIMARY,
  },
  dayLabel: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
});
