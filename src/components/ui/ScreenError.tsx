/**
 * Composant d'erreur réutilisable pour les écrans
 * Affiche un message d'erreur avec bouton de réessai
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, CI_ORANGE, CALORIES_RED,
  TEXT_PRIMARY, TEXT_SECONDARY,
  FONT_FAMILY, FONT_FAMILY_BOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../../constants/theme';

interface ScreenErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function ScreenError({ message, onRetry }: ScreenErrorProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color={CALORIES_RED} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={16} color="#FFF" />
          <Text style={styles.buttonText}>Réessayer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: CI_ORANGE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.pill,
    marginTop: SPACING.sm,
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    color: '#FFF',
    fontFamily: FONT_FAMILY_BOLD,
  },
});
