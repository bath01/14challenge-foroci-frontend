/**
 * Écran Timer - Chronomètre d'exercice et compte à rebours de repos
 * Cercle SVG animé pour visualiser le temps restant de repos
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import {
  DARK_BG, BORDER, CI_ORANGE, CI_GREEN,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM, CALORIES_RED,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { formatTimer } from '../utils/formatters';

// Presets de durée de repos (en secondes)
const REST_PRESETS = [30, 45, 60, 90, 120];

// Dimensions du cercle SVG
const CIRCLE_SIZE = 220;
const CIRCLE_RADIUS = 100;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function TimerScreen() {
  const {
    exerciseTimer, restTimer, timerRunning, timerMode,
    restDuration, setRestDuration,
    startExerciseTimer, startRestTimer, pauseTimer, stopTimer,
  } = useTimer();

  // Calcul de l'offset pour l'animation du cercle de repos
  const progressOffset = timerMode === 'rest' && restTimer > 0
    ? CIRCLE_CIRCUMFERENCE * (1 - restTimer / restDuration)
    : CIRCLE_CIRCUMFERENCE;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Timer</Text>

      {/* Cercle du timer */}
      <View style={styles.timerContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
          {/* Cercle de fond */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_RADIUS}
            fill="none"
            stroke={BORDER}
            strokeWidth={4}
          />
          {/* Cercle de progression (repos uniquement) */}
          {timerMode === 'rest' && restTimer > 0 && (
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke={CI_GREEN}
              strokeWidth={5}
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              rotation={-90}
              origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
            />
          )}
        </Svg>

        {/* Contenu textuel au centre du cercle */}
        <View style={styles.timerOverlay}>
          <Text style={[styles.timerLabel, { color: timerMode === 'exercise' ? CI_ORANGE : CI_GREEN }]}>
            {timerMode === 'exercise' ? 'Exercice' : 'Repos'}
          </Text>
          <Text style={styles.timerValue}>
            {timerMode === 'exercise' ? formatTimer(exerciseTimer) : formatTimer(restTimer)}
          </Text>
          {timerRunning && (
            <Text style={styles.timerStatus}>
              {timerMode === 'exercise' ? 'En cours...' : 'Récupération'}
            </Text>
          )}
        </View>
      </View>

      {/* Boutons de contrôle */}
      <View style={styles.controls}>
        {!timerRunning ? (
          <>
            <TouchableOpacity style={styles.btnPrimary} onPress={startExerciseTimer} activeOpacity={0.8}>
              <Text style={styles.btnPrimaryText}>Exercice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => startRestTimer()} activeOpacity={0.8}>
              <Text style={styles.btnOutlineText}>Repos</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.btnPrimary} onPress={pauseTimer} activeOpacity={0.8}>
              <Text style={styles.btnPrimaryText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDanger} onPress={stopTimer} activeOpacity={0.8}>
              <Text style={styles.btnDangerText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Presets de durée de repos */}
      <Text style={styles.presetsLabel}>Durée de repos</Text>
      <View style={styles.presets}>
        {REST_PRESETS.map(duration => {
          const isActive = restDuration === duration;
          return (
            <TouchableOpacity
              key={duration}
              style={[styles.presetBtn, isActive && styles.presetBtnActive]}
              onPress={() => {
                setRestDuration(duration);
                if (!timerRunning) startRestTimer(duration);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.presetBtnText, isActive && styles.presetBtnTextActive]}>
                {duration}s
              </Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.hero,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    color: TEXT_PRIMARY,
    marginBottom: SPACING.xl,
    alignSelf: 'flex-start',
  },
  timerContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    marginBottom: SPACING.xxl,
    position: 'relative',
  },
  timerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY_BOLD,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  timerValue: {
    fontSize: FONT_SIZE.timer,
    fontFamily: FONT_FAMILY,
    fontWeight: '200',
    color: TEXT_PRIMARY,
    letterSpacing: -2,
  },
  timerStatus: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SPACING.xxl,
  },
  btnPrimary: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: CI_ORANGE,
  },
  btnPrimaryText: {
    color: '#FFF',
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_BOLD,
  },
  btnOutline: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'transparent',
  },
  btnOutlineText: {
    color: CI_GREEN,
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  btnDanger: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'transparent',
  },
  btnDangerText: {
    color: CALORIES_RED,
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  presetsLabel: {
    fontSize: FONT_SIZE.sm,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  presets: {
    flexDirection: 'row',
    gap: 6,
  },
  presetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'transparent',
  },
  presetBtnActive: {
    backgroundColor: `${CI_GREEN}20`,
    borderColor: 'transparent',
  },
  presetBtnText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY,
    color: TEXT_SECONDARY,
  },
  presetBtnTextActive: {
    color: CI_GREEN,
  },
});
