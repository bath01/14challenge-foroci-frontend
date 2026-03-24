/**
 * Carte de statistique compacte et cliquable
 * Affiche une icône Ionicons, une valeur et un label
 * Peut naviguer vers un onglet au tap
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  onPress?: () => void;
}

export default function StatCard({ iconName, value, label, color = CI_ORANGE, onPress }: StatCardProps) {
  const content = (
    <>
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{content}</View>;
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
