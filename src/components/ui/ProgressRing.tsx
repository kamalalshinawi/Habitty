import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

type Props = {
  progress: number; // 0 to 1
  size?: number;
  label?: string;
};

export default function ProgressRing({ progress, size = 60, label }: Props) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const radius = (size - 8) / 2;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { borderRadius: size / 2 }]}>
        <Text style={styles.progressText}>{Math.round(clamped * 100)}%</Text>
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderWidth: 6,
    borderColor: Colors.tint,
    borderLeftColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  label: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
});
