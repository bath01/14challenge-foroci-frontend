/**
 * Loader thématique ForoCI pour les écrans
 * Cercle pulsant, haltère animée et barres drapeau CI
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CI_ORANGE, CI_GREEN, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_BOLD, FONT_SIZE,
} from '../../constants/theme';
import FlagBar from './FlagBar';

interface ScreenLoaderProps {
  message?: string;
}

export default function ScreenLoader({ message = 'Chargement...' }: ScreenLoaderProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Rotation de l'haltère
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    // Pulsation du cercle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    // Points de chargement en cascade
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]),
      );
    animateDot(dot1, 0).start();
    animateDot(dot2, 150).start();
    animateDot(dot3, 300).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-12deg', '12deg'],
  });

  return (
    <View style={styles.container}>
      {/* Cercle pulsant */}
      <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />

      {/* Haltère animée */}
      <Animated.View style={{ transform: [{ rotate: rotation }], marginBottom: 14 }}>
        <Ionicons name="barbell" size={36} color={CI_ORANGE} />
      </Animated.View>

      {/* Barre drapeau CI */}
      <FlagBar width={32} height={3} />

      {/* Points de chargement */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { backgroundColor: CI_ORANGE, opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: '#FFF', opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: CI_GREEN, opacity: dot3 }]} />
      </View>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pulseCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: `${CI_ORANGE}06`,
    borderWidth: 1,
    borderColor: `${CI_ORANGE}12`,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.3,
  },
});
