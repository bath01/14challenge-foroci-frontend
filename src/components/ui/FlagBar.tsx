/**
 * Barre aux couleurs du drapeau ivoirien (orange, blanc, vert)
 * Élément décoratif utilisé dans l'en-tête et la page À propos
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CI_ORANGE, CI_GREEN } from '../../constants/theme';

interface FlagBarProps {
  width?: number;
  height?: number;
}

export default function FlagBar({ width = 28, height = 3 }: FlagBarProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={[styles.stripe, { backgroundColor: CI_ORANGE }]} />
      <View style={[styles.stripe, { backgroundColor: '#FFF' }]} />
      <View style={[styles.stripe, { backgroundColor: CI_GREEN }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
  },
  stripe: {
    flex: 1,
  },
});
