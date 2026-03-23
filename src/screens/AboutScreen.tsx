/**
 * Écran À propos
 * Présentation du projet, de l'équipe et de la stack technique
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  DARK_BG, CARD, BORDER, SURFACE, CI_ORANGE, CI_GREEN,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import FlagBar from '../components/ui/FlagBar';
import { teamMembers } from '../data/mockData';

// Stack technique du projet
const TECH_STACK = ['React Native', 'Next.js (API)', 'Expo'];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Présentation du projet */}
      <View style={styles.card}>
        <FlagBar width={48} height={30} />
        <Text style={styles.appTitle}>ForoCI</Text>
        <Text style={styles.description}>
          Jour 9 du Challenge 14-14-14. ForoCI est un fitness tracker mobile. "Foro" signifie
          force et courage en malinké. Suis tes entraînements, tes progressions et atteins tes objectifs.
        </Text>
        <Text style={styles.description}>
          Design mobile-first avec interface sombre, navigation par onglets et visualisations
          de progression aux couleurs de la Côte d'Ivoire.
        </Text>
      </View>

      {/* Équipe */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>L'équipe</Text>
        {teamMembers.map((member, i) => {
          // Génère les initiales à partir du nom
          const initials = member.name
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('');

          return (
            <View key={i} style={[styles.memberRow, i < teamMembers.length - 1 && { marginBottom: 10 }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Stack technique */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Stack</Text>
        {TECH_STACK.map((tech, i) => (
          <View key={i} style={[styles.techItem, i < TECH_STACK.length - 1 && { marginBottom: 4 }]}>
            <Text style={styles.techText}>{tech}</Text>
          </View>
        ))}
      </View>

      {/* Open source */}
      <View style={styles.openSourceCard}>
        <Text style={styles.openSourceText}>
          Open Source sur <Text style={styles.orangeText}>225os.com</Text>
          {' & '}
          <Text style={styles.greenText}>GitHub</Text>
        </Text>
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
  card: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  appTitle: {
    fontSize: FONT_SIZE.display,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: CI_ORANGE,
    marginTop: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: FONT_SIZE.lg,
    lineHeight: 23,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Dégradé simulé via couleur intermédiaire (pas de LinearGradient nécessaire ici)
    backgroundColor: CI_ORANGE,
  },
  avatarText: {
    color: '#FFF',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY_BOLD,
  },
  memberName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: TEXT_PRIMARY,
  },
  memberRole: {
    fontSize: FONT_SIZE.xs,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  techItem: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  techText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY,
    color: CI_GREEN,
  },
  openSourceCard: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  openSourceText: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  orangeText: {
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  greenText: {
    color: CI_GREEN,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
});
