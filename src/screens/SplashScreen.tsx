/**
 * Écran de démarrage (Splash Screen)
 * Animation d'introduction avec logo ForoCI, drapeau CI et slogan
 * S'affiche pendant le chargement initial puis disparaît avec un fondu
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CI_ORANGE, CI_GREEN, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE,
} from '../constants/theme';
import FlagBar from '../components/ui/FlagBar';

interface SplashScreenProps {
  /** Appelé quand l'animation est terminée */
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animations d'entrée séquentielles
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const flagOpacity = useRef(new Animated.Value(0)).current;
  const flagScale = useRef(new Animated.Value(0)).current;
  const barsOpacity = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  // Animation de rotation subtile de l'icône
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Cercles décoratifs pulsants
  const ring1 = useRef(new Animated.Value(0.5)).current;
  const ring2 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Pulsation des cercles en arrière-plan
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring1, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(ring1, { toValue: 0.5, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ring2, { toValue: 0.8, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(ring2, { toValue: 0.3, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    // Rotation douce de l'icône
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    // Séquence d'apparition principale
    Animated.sequence([
      // 1. Logo apparaît avec un effet de zoom
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),

      // 2. Titre "ForoCI" glisse vers le haut
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(titleTranslateY, { toValue: 0, friction: 8, tension: 50, useNativeDriver: true }),
      ]),

      // 3. Barre drapeau CI apparaît
      Animated.parallel([
        Animated.timing(flagOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(flagScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]),

      // 4. Slogan apparaît
      Animated.timing(sloganOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),

      // 5. Barres de chargement
      Animated.timing(barsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),

      // 6. Pause pour laisser admirer (durée totale ~5 secondes)
      Animated.delay(2500),

      // 7. Fondu de sortie
      Animated.timing(fadeOut, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-8deg', '8deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Cercles décoratifs pulsants */}
      <Animated.View style={[styles.ring, styles.ringOuter, { opacity: ring2, transform: [{ scale: ring2 }] }]} />
      <Animated.View style={[styles.ring, styles.ringInner, { opacity: ring1, transform: [{ scale: ring1 }] }]} />

      {/* Logo icône animé */}
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }, { rotate: rotation }] }]}>
        <View style={styles.logoCircle}>
          <Ionicons name="barbell" size={56} color={CI_ORANGE} />
        </View>
      </Animated.View>

      {/* Titre de l'app */}
      <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }}>
        <Text style={styles.title}>FOROCI</Text>
      </Animated.View>

      {/* Barre drapeau CI */}
      <Animated.View style={{ opacity: flagOpacity, transform: [{ scale: flagScale }], marginVertical: 12 }}>
        <FlagBar width={60} height={5} />
      </Animated.View>

      {/* Slogan */}
      <Animated.View style={{ opacity: sloganOpacity }}>
        <Text style={styles.slogan}>Ta force, c'est ta discipline</Text>
      </Animated.View>

      {/* Barres de chargement animées */}
      <Animated.View style={[styles.loadingBars, { opacity: barsOpacity }]}>
        <LoadingDots />
      </Animated.View>

      {/* Crédit en bas */}
      <Animated.View style={[styles.footer, { opacity: sloganOpacity }]}>
        <Text style={styles.footerText}>Challenge 14-14-14</Text>
        <Text style={styles.footerSubtext}>Jour 9 — Fitness Tracker</Text>
      </Animated.View>
    </Animated.View>
  );
}

/** Points de chargement animés en bas du splash */
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
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

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, { backgroundColor: CI_ORANGE, opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { backgroundColor: '#FFF', opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { backgroundColor: CI_GREEN, opacity: dot3 }]} />
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
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  ringOuter: {
    width: 250,
    height: 250,
    borderColor: `${CI_ORANGE}10`,
    backgroundColor: `${CI_ORANGE}03`,
  },
  ringInner: {
    width: 170,
    height: 170,
    borderColor: `${CI_GREEN}12`,
    backgroundColor: `${CI_GREEN}05`,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${CI_ORANGE}10`,
    borderWidth: 2,
    borderColor: `${CI_ORANGE}25`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: CI_ORANGE,
    letterSpacing: 4,
  },
  slogan: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.5,
  },
  loadingBars: {
    marginTop: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZE.body,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY_BOLD,
    letterSpacing: 1,
  },
  footerSubtext: {
    fontSize: FONT_SIZE.xs,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    marginTop: 4,
    opacity: 0.6,
  },
});
