/**
 * Point d'entrée principal de l'application ForoCI
 * Charge les polices DM Sans et initialise la navigation
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
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
import ForoLoader from './src/components/ui/ForoLoader';

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

  // Loader thématique pendant le téléchargement des polices
  if (!fontsLoaded) {
    return <ForoLoader message="Chargement..." />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
