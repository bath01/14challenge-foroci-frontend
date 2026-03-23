/**
 * Point d'entrée principal de l'application ForoCI
 * Charge les polices DM Sans et initialise la navigation
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { DARK_BG, CI_ORANGE } from './src/constants/theme';

export default function App() {
  // Chargement des polices DM Sans (toutes les graisses utilisées dans la maquette)
  const [fontsLoaded] = useFonts({
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  });

  // Écran de chargement pendant le téléchargement des polices
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={CI_ORANGE} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: DARK_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
