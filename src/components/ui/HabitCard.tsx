import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';
import type { Habit, HabitStatus } from '../../types/habit';

type Props = {
  habit: Habit;
  status: HabitStatus;
  streak: number;
  onComplete: () => void;
  onPress?: () => void;
};

export default function HabitCard({ habit, status, streak, onComplete, onPress }: Props) {
  const { colors } = useTheme();
  const isDone = status === 'done';
  const color = habit.color ?? colors.tint;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: color,
        },
      ]}
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
          <Text style={[styles.title, { color: colors.text }]}>{habit.title}</Text>
          {habit.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {habit.description}
            </Text>
          ) : null}
          <View style={styles.streakContainer}>
            <FontAwesome name="fire" size={13} color={colors.warning} />
            <Text style={[styles.streakText, { color: colors.textSecondary }]}>
              {streak} day streak
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              backgroundColor: isDone ? color : colors.background,
              borderColor: color,
            },
          ]}
          onPress={onComplete}
          activeOpacity={0.7}
        >
          {isDone && (
            <FontAwesome name="check" size={14} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
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
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginBottom: 6,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
