/**
 * Carte de statistique compacte
 * Affiche une icône Ionicons, une valeur et un label (ex: séances, calories, streak)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  CARD, BORDER, TEXT_SECONDARY, CI_ORANGE,
  FONT_FAMILY_EXTRABOLD, FONT_FAMILY,
  FONT_SIZE, BORDER_RADIUS,
} from '../../constants/theme';

interface StatCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
}

export default function StatCard({ iconName, value, label, color = CI_ORANGE }: StatCardProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: FONT_SIZE.h1,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    marginTop: 6,
    marginBottom: 2,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
