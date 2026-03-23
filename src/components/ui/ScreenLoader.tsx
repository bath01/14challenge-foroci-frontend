/**
 * Loader compact pour les écrans et sections
 * Haltère qui pulse avec le message contextuel
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CI_ORANGE, TEXT_DIM } from '../../constants/theme';

interface ScreenLoaderProps {
  message?: string;
  size?: 'small' | 'medium';
}

export default function ScreenLoader({ message, size = 'medium' }: ScreenLoaderProps) {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const iconSize = size === 'small' ? 20 : 28;

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: pulseAnim }}>
        <Ionicons name="fitness" size={iconSize} color={CI_ORANGE} />
      </Animated.View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  message: {
    fontSize: 11,
    color: TEXT_DIM,
    letterSpacing: 0.3,
  },
});
