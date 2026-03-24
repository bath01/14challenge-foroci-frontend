/**
 * Écran À propos
 * Présentation du projet, de l'équipe et de la stack technique
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, SURFACE, CI_ORANGE, CI_GREEN,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import FlagBar from '../components/ui/FlagBar';
import { teamMembers } from '../data/mockData';

// Stack technique du projet
const TECH_STACK = [
  { name: 'React Native', icon: 'phone-portrait-outline' as const, desc: 'Application mobile' },
  { name: 'Expo', icon: 'rocket-outline' as const, desc: 'Build & déploiement' },
  { name: 'Next.js API', icon: 'server-outline' as const, desc: 'Backend REST' },
  { name: 'TypeScript', icon: 'code-slash-outline' as const, desc: 'Typage strict' },
];

// Couleurs des avatars par index
const AVATAR_COLORS = [CI_ORANGE, CI_GREEN, '#6366F1'];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Présentation du projet */}
      <View style={styles.heroCard}>
        <FlagBar width={56} height={5} />
        <Text style={styles.appTitle}>ForoCI</Text>
        <Text style={styles.tagline}>Ta force, c'est ta discipline</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          Jour 9 du Challenge 14-14-14. ForoCI est un fitness tracker mobile.
          "Foro" signifie force et courage en malinké.
        </Text>
        <Text style={styles.description}>
          Suis tes entraînements, tes progressions et atteins tes objectifs
          avec une interface aux couleurs de la Côte d'Ivoire.
        </Text>
      </View>

      {/* Équipe */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people-outline" size={16} color={CI_ORANGE} />
          <Text style={styles.sectionLabel}>L'équipe</Text>
        </View>
        {teamMembers.map((member, i) => {
          const initials = member.name
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('');

          return (
            <View key={i} style={[styles.memberRow, i < teamMembers.length - 1 && styles.memberBorder]}>
              <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Stack technique */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="layers-outline" size={16} color={CI_GREEN} />
          <Text style={styles.sectionLabel}>Stack technique</Text>
        </View>
        <View style={styles.techGrid}>
          {TECH_STACK.map((tech, i) => (
            <View key={i} style={styles.techItem}>
              <Ionicons name={tech.icon} size={20} color={CI_GREEN} />
              <Text style={styles.techName}>{tech.name}</Text>
              <Text style={styles.techDesc}>{tech.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Open source */}
      <View style={styles.openSourceCard}>
        <Ionicons name="heart-outline" size={20} color={CI_ORANGE} />
        <Text style={styles.openSourceTitle}>Open Source</Text>
        <Text style={styles.openSourceText}>
          Disponible sur <Text style={styles.orangeText}>225os.com</Text>
          {' & '}
          <Text style={styles.greenText}>GitHub</Text>
        </Text>
      </View>

      {/* Version */}
      <Text style={styles.version}>ForoCI v1.0.0 — Challenge 14-14-14</Text>
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
  heroCard: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: CI_ORANGE,
    marginTop: 16,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginTop: 4,
    marginBottom: 16,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 16,
  },
  description: {
    fontSize: FONT_SIZE.lg,
    lineHeight: 22,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY_BOLD,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  memberBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY_BOLD,
  },
  memberName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: TEXT_PRIMARY,
  },
  memberRole: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techItem: {
    width: '47%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    gap: 6,
  },
  techName: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
  },
  techDesc: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY,
    color: TEXT_DIM,
  },
  openSourceCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: SPACING.lg,
    gap: 8,
  },
  openSourceTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
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
  version: {
    textAlign: 'center',
    fontSize: FONT_SIZE.xs,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    opacity: 0.5,
  },
});
