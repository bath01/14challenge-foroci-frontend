/**
 * Écran d'accueil - Tableau de bord principal
 * Statistiques cliquables, calendrier, poids et dernière séance
 * Données chargées depuis l'API
 */

import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, CI_ORANGE, CI_GREEN, CALORIES_RED,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { apiGet, ENDPOINTS } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/ui/StatCard';
import MiniBarChart from '../components/ui/MiniBarChart';
import Calendar from '../components/home/Calendar';
import FlagBar from '../components/ui/FlagBar';
import ScreenLoader from '../components/ui/ScreenLoader';
import ScreenError from '../components/ui/ScreenError';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();

  /** Confirmation avant déconnexion */
  function handleLogout() {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  // Chargement des séances
  const fetchWorkouts = useCallback(() => apiGet<any[]>(ENDPOINTS.WORKOUTS), []);
  const { data: workouts, isLoading: loadingWorkouts, error: errorWorkouts, refresh: refreshWorkouts } = useApi(fetchWorkouts);

  // Chargement des programmes
  const fetchPrograms = useCallback(() => apiGet<any[]>(ENDPOINTS.PROGRAMS), []);
  const { data: programs, refresh: refreshPrograms } = useApi(fetchPrograms);

  // Chargement de l'historique du poids
  const fetchWeight = useCallback(() => apiGet<any[]>(ENDPOINTS.METRICS_WEIGHT), []);
  const { data: weightHistory, isLoading: loadingWeight, refresh: refreshWeight } = useApi(fetchWeight);

  // Chargement du calendrier du mois
  const fetchCalendar = useCallback(() => {
    const now = new Date();
    const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
    return apiGet<any>(`${ENDPOINTS.METRICS_CALENDAR}?from=${from}&to=${to}`);
  }, []);
  const { data: calendarData, refresh: refreshCalendar } = useApi(fetchCalendar);

  const isLoading = loadingWorkouts || loadingWeight;
  const [refreshing, setRefreshing] = React.useState(false);

  /** Pull-to-refresh : recharger toutes les données */
  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([refreshWorkouts(), refreshPrograms(), refreshWeight(), refreshCalendar()]);
    setRefreshing(false);
  }

  if (isLoading && !refreshing) {
    return <ScreenLoader />;
  }

  if (errorWorkouts) {
    return <ScreenError message={errorWorkouts} onRetry={refreshWorkouts} />;
  }

  // Calcul des statistiques
  const workoutList = workouts || [];
  const programList = programs || [];
  const totalSeances = workoutList.length;
  const totalExercices = workoutList.reduce((acc: number, w: any) => acc + (w._count?.exercises || 0), 0);
  const totalPrograms = programList.length;

  const lastWorkout = workoutList[0];
  const weights = Array.isArray(weightHistory) ? weightHistory : [];
  const currentWeight = weights.length > 0 ? weights[weights.length - 1] : null;

  // Données du graphique de poids
  const weightChartData = weights.map((w: any) => ({
    value: w.value || w.weight,
    label: (w.date || w.createdAt || '').split('-').pop()?.split('T')[0] || '',
  }));

  // Prénom de l'utilisateur pour le salut
  const displayName = user?.firstName || 'champion';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={CI_ORANGE} />
      }
    >
      {/* En-tête de bienvenue */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandName}>ForoCI</Text>
            <FlagBar width={32} height={3} />
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={22} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Salut {displayName} ! </Text>
          <Ionicons name="fitness" size={24} color={CI_ORANGE} />
        </View>
        <Text style={styles.subtitle}>Ta force, c'est ta discipline</Text>
      </View>

      {/* Cartes de statistiques cliquables */}
      <View style={styles.statsRow}>
        <StatCard
          iconName="barbell-outline"
          value={totalSeances}
          label="Séances"
          color={CI_ORANGE}
          onPress={() => navigation.navigate('Workouts')}
        />
        <StatCard
          iconName="calendar-outline"
          value={totalPrograms}
          label="Programmes"
          color={CALORIES_RED}
          onPress={() => navigation.navigate('Programs')}
        />
        <StatCard
          iconName="flash-outline"
          value={totalExercices}
          label="Exercices"
          color={CI_GREEN}
          onPress={() => navigation.navigate('Workouts')}
        />
      </View>

      {/* Calendrier du mois */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </Text>
          <Text style={styles.cardBadge}>{totalSeances} séances</Text>
        </View>
        <Calendar workoutDays={calendarData} />
      </View>

      {/* Progression du poids corporel */}
      {weights.length > 0 && currentWeight && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Poids corporel</Text>
              <Text style={styles.cardSubtitle}>Dernière semaine</Text>
            </View>
            <View style={styles.weightRight}>
              <Text style={styles.weightValue}>{currentWeight.value || currentWeight.weight} kg</Text>
              {weights.length >= 2 && (
                <Text style={styles.weightDelta}>
                  {((currentWeight.value || currentWeight.weight) - (weights[0].value || weights[0].weight)).toFixed(1)} kg
                </Text>
              )}
            </View>
          </View>
          <MiniBarChart data={weightChartData} height={50} color={CI_GREEN} />
        </View>
      )}

      {/* Dernière séance — cliquable */}
      {lastWorkout && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Workouts')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dernière séance</Text>
            <Ionicons name="chevron-forward" size={16} color={TEXT_DIM} />
          </View>
          <Text style={styles.lastWorkoutName}>{lastWorkout.name}</Text>
          {lastWorkout.description ? (
            <Text style={styles.lastWorkoutDesc} numberOfLines={2}>{lastWorkout.description}</Text>
          ) : null}
          <View style={styles.lastWorkoutMeta}>
            <View style={styles.metaBadge}>
              <Ionicons name="barbell-outline" size={12} color={CI_ORANGE} />
              <Text style={styles.metaText}>{lastWorkout._count?.exercises || 0} exercices</Text>
            </View>
            <Text style={styles.metaDate}>
              {new Date(lastWorkout.createdAt).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Programmes rapides — aperçu cliquable */}
      {programList.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Programmes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Programs')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {programList.slice(0, 3).map((prog: any) => (
            <TouchableOpacity
              key={prog.id}
              style={styles.programRow}
              onPress={() => navigation.navigate('Programs')}
              activeOpacity={0.7}
            >
              <View style={styles.programIcon}>
                <Ionicons name="fitness" size={16} color={CI_ORANGE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.programName}>{prog.name}</Text>
                <Text style={styles.programMeta}>
                  {prog._count?.workouts || 0} séances — {prog.difficulty === 'BEGINNER' ? 'Débutant' : prog.difficulty === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={TEXT_DIM} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  logoutButton: {
    padding: SPACING.sm,
  },
  brandName: {
    fontSize: FONT_SIZE.md,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_BOLD,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: FONT_SIZE.display,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  cardBadge: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  seeAll: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  weightRight: {
    alignItems: 'flex-end',
  },
  weightValue: {
    fontSize: FONT_SIZE.h1,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: CI_GREEN,
    marginBottom: 2,
  },
  weightDelta: {
    fontSize: FONT_SIZE.sm,
    color: CI_GREEN,
    fontFamily: FONT_FAMILY,
  },

  // Dernière séance
  lastWorkoutName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  lastWorkoutDesc: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 10,
    lineHeight: 16,
  },
  lastWorkoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${CI_ORANGE}12`,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  metaDate: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
  },

  // Programmes aperçu
  programRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  programIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: `${CI_ORANGE}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  programName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: TEXT_PRIMARY,
  },
  programMeta: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
  },
});
