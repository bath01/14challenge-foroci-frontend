/**
 * Modal de planification d'une séance sur un jour du calendrier
 * Permet de choisir un programme puis une séance, ou de supprimer le planning
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  ScrollView, Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, SURFACE, CI_ORANGE, CI_GREEN,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../../constants/theme';
import { apiGet, ENDPOINTS } from '../../services/api';
import { ScheduleEntry } from '../../services/schedule';
import ScreenLoader from '../ui/ScreenLoader';

interface ScheduleModalProps {
  visible: boolean;
  date: string; // YYYY-MM-DD
  displayDate: string; // ex: "24 mars"
  existingEntry?: ScheduleEntry | null;
  onSchedule: (entry: ScheduleEntry) => void;
  onRemove: () => void;
  onClose: () => void;
}

/** Étape du modal */
type Step = 'choose' | 'workouts';

export default function ScheduleModal({
  visible, date, displayDate, existingEntry,
  onSchedule, onRemove, onClose,
}: ScheduleModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [programs, setPrograms] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Charger les programmes au premier affichage
  useEffect(() => {
    if (visible) {
      setStep('choose');
      setSelectedProgram(null);
      loadPrograms();
    }
  }, [visible]);

  async function loadPrograms() {
    setLoading(true);
    try {
      const data = await apiGet<any[]>(ENDPOINTS.PROGRAMS);
      setPrograms(data || []);
    } catch {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }

  /** Sélectionner un programme → charger ses séances */
  async function handleSelectProgram(program: any) {
    setSelectedProgram(program);
    setLoading(true);
    try {
      const detail = await apiGet<any>(`/programs/${program.id}`);
      setWorkouts(detail.workouts || []);
    } catch {
      setWorkouts([]);
    } finally {
      setLoading(false);
      setStep('workouts');
    }
  }

  /** Sélectionner une séance → planifier */
  function handleSelectWorkout(workout: any) {
    onSchedule({
      date,
      workoutId: workout.id,
      workoutName: workout.name,
      programId: selectedProgram?.id,
      programName: selectedProgram?.name,
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.handle} />
          <View style={styles.header}>
            {step === 'workouts' ? (
              <TouchableOpacity onPress={() => setStep('choose')}>
                <Ionicons name="arrow-back" size={20} color={TEXT_SECONDARY} />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 20 }} />
            )}
            <View style={styles.headerCenter}>
              <Text style={styles.headerDate}>{displayDate}</Text>
              <Text style={styles.headerTitle}>
                {step === 'choose' ? 'Planifier une séance' : selectedProgram?.name}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>

          {/* Entrée existante */}
          {existingEntry && step === 'choose' && (
            <View style={styles.existingCard}>
              <View style={styles.existingInfo}>
                <Ionicons name="calendar" size={16} color={CI_ORANGE} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.existingName}>{existingEntry.workoutName}</Text>
                  {existingEntry.programName && (
                    <Text style={styles.existingProgram}>{existingEntry.programName}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
                <Ionicons name="trash-outline" size={16} color="#E53E3E" />
                <Text style={styles.removeText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={{ height: 150 }}>
                <ScreenLoader message="Chargement..." />
              </View>
            ) : step === 'choose' ? (
              /* Liste des programmes */
              <>
                <Text style={styles.sectionLabel}>Choisir un programme</Text>
                {programs.map((prog: any) => (
                  <TouchableOpacity
                    key={prog.id}
                    style={styles.programRow}
                    onPress={() => handleSelectProgram(prog)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.programIcon}>
                      <Ionicons name="fitness" size={18} color={CI_ORANGE} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.programName}>{prog.name}</Text>
                      <Text style={styles.programMeta}>
                        {prog._count?.workouts || 0} séances — {
                          prog.difficulty === 'BEGINNER' ? 'Débutant' :
                          prog.difficulty === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'
                        }
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={TEXT_DIM} />
                  </TouchableOpacity>
                ))}
                {programs.length === 0 && (
                  <Text style={styles.emptyText}>Aucun programme disponible</Text>
                )}
              </>
            ) : (
              /* Liste des séances du programme */
              <>
                <Text style={styles.sectionLabel}>Choisir une séance</Text>
                {workouts.map((workout: any, i: number) => (
                  <TouchableOpacity
                    key={workout.id}
                    style={styles.workoutRow}
                    onPress={() => handleSelectWorkout(workout)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.workoutIndex}>
                      <Text style={styles.workoutIndexText}>{i + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      {workout.description && (
                        <Text style={styles.workoutDesc} numberOfLines={1}>{workout.description}</Text>
                      )}
                    </View>
                    <View style={styles.addBadge}>
                      <Ionicons name="add" size={14} color={CI_GREEN} />
                    </View>
                  </TouchableOpacity>
                ))}
                {workouts.length === 0 && (
                  <Text style={styles.emptyText}>Aucune séance dans ce programme</Text>
                )}
              </>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: DARK_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: BORDER,
    maxHeight: '75%',
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerDate: {
    fontSize: FONT_SIZE.sm,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    color: TEXT_PRIMARY,
    fontFamily: FONT_FAMILY_BOLD,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY_BOLD,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Entrée existante
  existingCard: {
    margin: SPACING.lg,
    marginBottom: 0,
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: BORDER,
    padding: SPACING.md,
    gap: 10,
  },
  existingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  existingName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
  },
  existingProgram: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY,
    color: TEXT_DIM,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E53E3E30',
    backgroundColor: '#E53E3E08',
  },
  removeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: '#E53E3E',
  },

  // Programmes
  programRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  programIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    fontFamily: FONT_FAMILY,
    color: TEXT_DIM,
  },

  // Séances
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  workoutIndex: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: `${CI_ORANGE}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutIndexText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY_BOLD,
    color: CI_ORANGE,
  },
  workoutName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY_SEMIBOLD,
    color: TEXT_PRIMARY,
  },
  workoutDesc: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY,
    color: TEXT_DIM,
  },
  addBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: `${CI_GREEN}15`,
    borderWidth: 1,
    borderColor: `${CI_GREEN}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: FONT_SIZE.md,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
