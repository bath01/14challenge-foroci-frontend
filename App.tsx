/**
 * Point d'entrée principal de l'application ForoCI
 * Charge les polices, affiche le splash screen, gère l'authentification
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import SplashScreen from './src/screens/SplashScreen';
import ForoLoader from './src/components/ui/ForoLoader';

/** Sélection du navigateur selon l'état d'authentification */
function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Chargement de la session persistée
  if (isLoading) {
    return <ForoLoader message="Connexion..." />;
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  // Chargement des polices DM Sans
  const [fontsLoaded] = useFonts({
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  });

  // Tant que les polices ne sont pas chargées, loader basique
  if (!fontsLoaded) {
    return <ForoLoader message="Chargement..." />;
  }

  // Splash screen animé au premier lancement
  if (!splashDone) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setSplashDone(true)} />
      </>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
