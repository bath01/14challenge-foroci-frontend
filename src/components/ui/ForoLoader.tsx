/**
 * Loader principal de l'application ForoCI
 * Animation fitness avec les couleurs CI (orange/vert) et icône haltère
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CI_ORANGE, CI_GREEN, TEXT_SECONDARY, TEXT_DIM,
} from '../../constants/theme';
import FlagBar from './FlagBar';

interface ForoLoaderProps {
  message?: string;
}

export default function ForoLoader({ message = 'Préparation...' }: ForoLoaderProps) {
  // Animation de rotation de l'icône haltère
  const rotateAnim = useRef(new Animated.Value(0)).current;
  // Animation de pulsation du cercle
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Animation d'opacité des barres de progression
  const bar1Anim = useRef(new Animated.Value(0.3)).current;
  const bar2Anim = useRef(new Animated.Value(0.3)).current;
  const bar3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Rotation continue de l'haltère (simule un mouvement d'exercice)
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Pulsation du cercle de fond
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Barres de progression en cascade (simule un chargement)
    const animateBar = (bar: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(bar, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 0.3,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      );

    animateBar(bar1Anim, 0).start();
    animateBar(bar2Anim, 200).start();
    animateBar(bar3Anim, 400).start();
  }, []);

  // Interpolation de la rotation (-15° à +15°)
  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <View style={styles.container}>
      {/* Cercle pulsant de fond */}
      <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />

      {/* Icône haltère animée */}
      <Animated.View style={[styles.iconContainer, { transform: [{ rotate: rotateInterpolation }] }]}>
        <Ionicons name="barbell" size={48} color={CI_ORANGE} />
      </Animated.View>

      {/* Nom de l'app */}
      <Text style={styles.title}>ForoCI</Text>

      {/* Barre drapeau CI */}
      <FlagBar width={40} height={4} />

      {/* Barres de progression animées */}
      <View style={styles.barsContainer}>
        <Animated.View style={[styles.bar, { opacity: bar1Anim, backgroundColor: CI_ORANGE }]} />
        <Animated.View style={[styles.bar, { opacity: bar2Anim, backgroundColor: '#FFF' }]} />
        <Animated.View style={[styles.bar, { opacity: bar3Anim, backgroundColor: CI_GREEN }]} />
      </View>

      {/* Message de chargement */}
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
  },
  pulseCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${CI_ORANGE}08`,
    borderWidth: 1,
    borderColor: `${CI_ORANGE}15`,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: CI_ORANGE,
    letterSpacing: 1,
    marginBottom: 12,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 24,
    marginBottom: 16,
  },
  bar: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  message: {
    fontSize: 12,
    color: TEXT_DIM,
    letterSpacing: 0.5,
  },
});
