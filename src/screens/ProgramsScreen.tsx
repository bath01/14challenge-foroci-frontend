/**
 * Écran Programmes d'entraînement
 * Liste les programmes disponibles avec vue détaillée des séances
 * Données chargées depuis l'API
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, CI_ORANGE, CI_GREEN,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { apiGet, apiPost, apiDelete, ENDPOINTS } from '../services/api';
import { useApi } from '../hooks/useApi';
import ScreenLoader from '../components/ui/ScreenLoader';
import ScreenError from '../components/ui/ScreenError';

/** Badge de difficulté avec couleur adaptée */
function difficultyLabel(difficulty: string): { text: string; color: string } {
  switch (difficulty) {
    case 'BEGINNER': return { text: 'Débutant', color: CI_GREEN };
    case 'INTERMEDIATE': return { text: 'Intermédiaire', color: CI_ORANGE };
    case 'ADVANCED': return { text: 'Avancé', color: '#E53E3E' };
    default: return { text: difficulty, color: TEXT_DIM };
  }
}

export default function ProgramsScreen() {
  const navigation = useNavigation<any>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  // Chargement des programmes depuis l'API
  const fetchPrograms = useCallback(() => apiGet<any[]>(ENDPOINTS.PROGRAMS), []);
  const { data: programs, isLoading, error, refresh } = useApi(fetchPrograms);

  // Programmes auxquels l'utilisateur est inscrit
  const fetchMyPrograms = useCallback(() => apiGet<any[]>(ENDPOINTS.USER_PROGRAMS), []);
  const { data: myPrograms, refresh: refreshMyPrograms } = useApi(fetchMyPrograms);

  // Détail d'un programme (avec ses séances)
  const fetchDetail = useCallback(
    () => selectedId ? apiGet<any>(`/programs/${selectedId}`) : Promise.resolve(null),
    [selectedId],
  );
  const { data: programDetail, isLoading: loadingDetail } = useApi(fetchDetail, !!selectedId);

  /** Vérifier si l'utilisateur est inscrit à un programme */
  function isEnrolled(programId: string): boolean {
    return (myPrograms || []).some((p: any) => p.id === programId);
  }

  /** S'inscrire ou se désinscrire d'un programme */
  async function toggleEnroll(programId: string) {
    setEnrolling(true);
    try {
      if (isEnrolled(programId)) {
        await apiDelete(`/programs/${programId}/enroll`);
      } else {
        await apiPost(`/programs/${programId}/enroll`, {});
      }
      refreshMyPrograms();
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de modifier l\'inscription.');
    } finally {
      setEnrolling(false);
    }
  }

  const [refreshing, setRefreshing] = React.useState(false);
  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([refresh(), refreshMyPrograms()]);
    setRefreshing(false);
  }

  if (isLoading && !refreshing) return <ScreenLoader />;
  if (error) return <ScreenError message={error} onRetry={refresh} />;

  const programList = programs || [];

  // Vue détaillée d'un programme
  if (selectedId) {
    if (loadingDetail || !programDetail) return <ScreenLoader message="Chargement du programme..." />;

    const detail = programDetail;
    const enrolled = isEnrolled(detail.id);
    const diff = difficultyLabel(detail.difficulty);
    const workouts = detail.workouts || [];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setSelectedId(null)}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{detail.name}</Text>
          <View style={styles.detailMeta}>
            <View style={[styles.diffBadge, { backgroundColor: `${diff.color}15` }]}>
              <Text style={[styles.diffText, { color: diff.color }]}>{diff.text}</Text>
            </View>
            <Text style={styles.detailCount}>{workouts.length} séances</Text>
          </View>
          {detail.description ? (
            <Text style={styles.detailDescription}>{detail.description}</Text>
          ) : null}

          {/* Liste des séances du programme */}
          {workouts.map((workout: any, i: number) => (
            <TouchableOpacity
              key={workout.id}
              style={[styles.workoutRow, i > 0 && styles.borderTop]}
              onPress={() => navigation.navigate('WorkoutSession', {
                workoutId: workout.id,
                workoutName: workout.name,
              })}
              activeOpacity={0.7}
            >
              <View style={styles.workoutOrderBadge}>
                <Text style={styles.workoutOrderText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                {workout.description ? (
                  <Text style={styles.workoutDesc}>{workout.description}</Text>
                ) : null}
              </View>
              <View style={styles.playBadge}>
                <Ionicons name="play" size={12} color={CI_ORANGE} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  // Liste des programmes
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={CI_ORANGE} />}
    >
      <Text style={styles.title}>Programmes</Text>
      <Text style={styles.subtitle}>Plans d'entraînement</Text>

      <View style={styles.list}>
        {programList.map((prog: any) => {
          const enrolled = isEnrolled(prog.id);
          const diff = difficultyLabel(prog.difficulty);
          const workoutCount = prog._count?.workouts || 0;

          return (
            <TouchableOpacity
              key={prog.id}
              style={[styles.programCard, enrolled && styles.programCardEnrolled]}
              onPress={() => setSelectedId(prog.id)}
              activeOpacity={0.7}
            >
              <View style={styles.programHeader}>
                <Text style={styles.programName}>{prog.name}</Text>
                {enrolled && (
                  <Ionicons name="checkmark-circle" size={16} color={CI_GREEN} />
                )}
              </View>

              {prog.description ? (
                <Text style={styles.programDescription} numberOfLines={2}>{prog.description}</Text>
              ) : null}

              <View style={styles.programMeta}>
                <View style={[styles.diffBadge, { backgroundColor: `${diff.color}15` }]}>
                  <Text style={[styles.diffText, { color: diff.color }]}>{diff.text}</Text>
                </View>
                <Text style={styles.programWorkouts}>{workoutCount} séances</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
  title: {
    fontSize: FONT_SIZE.hero,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: SPACING.xl,
  },
  list: {
    gap: 12,
  },
  programCard: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 4,
    borderLeftColor: CI_ORANGE,
    padding: SPACING.xl,
  },
  programCardEnrolled: {
    borderLeftColor: CI_GREEN,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  programName: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    flex: 1,
    marginRight: 8,
  },
  programDescription: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 10,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  programWorkouts: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  diffBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
  },
  diffText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },

  // Vue détaillée
  backButton: {
    color: CI_ORANGE,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    marginBottom: SPACING.lg,
  },
  detailCard: {
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.xl,
  },
  detailTitle: {
    fontSize: FONT_SIZE.h1,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  detailCount: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  detailDescription: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginBottom: 16,
    lineHeight: 18,
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: CI_ORANGE,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 10,
    marginBottom: 20,
  },
  enrolledButton: {
    backgroundColor: `${CI_GREEN}15`,
    borderWidth: 1,
    borderColor: `${CI_GREEN}40`,
  },
  enrollText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_BOLD,
    color: '#FFF',
  },
  enrolledText: {
    color: CI_GREEN,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  workoutOrderBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: `${CI_ORANGE}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutOrderText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_BOLD,
    color: CI_ORANGE,
  },
  workoutName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  workoutDesc: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  playBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${CI_ORANGE}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
