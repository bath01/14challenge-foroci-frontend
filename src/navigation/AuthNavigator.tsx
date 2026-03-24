/**
 * Navigation d'authentification (Stack)
 * Affichée quand l'utilisateur n'est pas connecté
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DARK_BG } from '../constants/theme';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: DARK_BG },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
