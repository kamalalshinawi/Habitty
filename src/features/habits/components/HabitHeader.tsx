import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import type { Habit } from '../types';

type Props = {
  habit: Habit;
};

export default function HabitHeader({ habit }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: habit.color ?? Colors.tint }]} />
      <Text style={styles.title}>{habit.title}</Text>
      {habit.description ? (
        <Text style={styles.desc}>{habit.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
