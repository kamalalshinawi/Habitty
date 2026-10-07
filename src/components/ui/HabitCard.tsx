import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Habit, HabitStatus } from '../../types/habit';

type Props = {
  habit: Habit;
  status: HabitStatus;
  streak: number;
  onComplete: () => void;
  onPress?: () => void;
};

export default function HabitCard({ habit, status, streak, onComplete, onPress }: Props) {
  const isDone = status === 'done';
  const color = habit.color ?? Colors.tint;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.content}>
        {habit.icon ? (
          <View style={[styles.iconCircle, { backgroundColor: `${color}18` }]}>
            <FontAwesome name={habit.icon as any} size={18} color={color} />
          </View>
        ) : null}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{habit.title}</Text>
          {habit.description ? (
            <Text style={styles.description}>{habit.description}</Text>
          ) : null}
          <View style={styles.streakContainer}>
            <FontAwesome name="fire" size={14} color={Colors.warning} />
            <Text style={styles.streakText}>{streak} day streak</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              backgroundColor: isDone ? color : Colors.background,
              borderColor: color,
            },
          ]}
          onPress={onComplete}
          activeOpacity={0.7}
        >
          {isDone && (
            <FontAwesome name="check" size={16} color={Colors.background} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
