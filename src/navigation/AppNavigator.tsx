/**
 * Navigation principale de l'app (authentifié)
 * Stack qui contient les tabs + les écrans plein écran (session workout)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DARK_BG } from '../constants/theme';
import BottomTabNavigator from './BottomTabNavigator';
import WorkoutSessionScreen from '../screens/WorkoutSessionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: DARK_BG },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="WorkoutSession"
        component={WorkoutSessionScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
