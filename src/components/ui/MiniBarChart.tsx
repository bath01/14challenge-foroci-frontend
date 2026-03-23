/**
 * Mini graphique en barres verticales
 * Utilisé pour afficher la progression du poids corporel
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TEXT_DIM, CI_ORANGE, FONT_FAMILY } from '../../constants/theme';
import { ChartDataPoint } from '../../types';

interface MiniBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
}

export default function MiniBarChart({ data, height = 60, color = CI_ORANGE }: MiniBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View style={[styles.container, { height }]}>
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const barHeight = maxValue > 0 ? (d.value / maxValue) * 100 : 0;

        return (
          <View key={i} style={styles.barWrapper}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${barHeight}%`,
                    backgroundColor: isLast ? color : `${color}40`,
                    minHeight: 2,
                  },
                ]}
              />
            </View>
            <Text style={styles.label}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    height: '100%',
  },
  barContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  label: {
    fontSize: 7,
    color: TEXT_DIM,
    fontFamily: FONT_FAMILY,
  },
});
