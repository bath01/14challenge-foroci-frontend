/**
 * Icône d'exercice utilisant Ionicons
 * Centralise le rendu des icônes pour les exercices du catalogue
 */

import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CI_ORANGE } from '../../constants/theme';

interface ExerciseIconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function ExerciseIcon({ name, size = 20, color = CI_ORANGE }: ExerciseIconProps) {
  return (
    <Ionicons
      name={name as keyof typeof Ionicons.glyphMap}
      size={size}
      color={color}
    />
  );
}
