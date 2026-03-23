/**
 * Navigation principale par onglets (Bottom Tabs)
 * 5 onglets : Accueil, Séances, Programmes, Timer, À propos
 * Icônes Ionicons natives
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  BORDER, CI_ORANGE, TEXT_DIM,
  FONT_FAMILY,
} from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ProgramsScreen from '../screens/ProgramsScreen';
import TimerScreen from '../screens/TimerScreen';
import AboutScreen from '../screens/AboutScreen';

// Configuration des onglets avec icônes Ionicons
const TAB_CONFIG = [
  { name: 'Home', component: HomeScreen, icon: 'home', iconOutline: 'home-outline', label: 'Accueil' },
  { name: 'Workouts', component: WorkoutsScreen, icon: 'clipboard', iconOutline: 'clipboard-outline', label: 'Séances' },
  { name: 'Programs', component: ProgramsScreen, icon: 'calendar', iconOutline: 'calendar-outline', label: 'Programmes' },
  { name: 'Timer', component: TimerScreen, icon: 'timer', iconOutline: 'timer-outline', label: 'Timer' },
  { name: 'About', component: AboutScreen, icon: 'information-circle', iconOutline: 'information-circle-outline', label: 'À propos' },
] as const;

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: CI_ORANGE,
        tabBarInactiveTintColor: TEXT_DIM,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {TAB_CONFIG.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.icon : tab.iconOutline}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(13,13,18,0.96)',
    borderTopColor: BORDER,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 20, // Safe area iOS
    height: 75,
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: FONT_FAMILY,
  },
});
