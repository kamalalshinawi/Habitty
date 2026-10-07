import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../features/habits/hooks/useHabits';
import HabitMonthlyCalendar from '../components/ui/HabitMonthlyCalendar';
import { Fonts } from '../constants/fonts';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { habits, habitDays, toggleDay } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string>(
    habits[0]?.id ?? '1'
  );

  const selectedHabit = habits.find((h) => h.id === selectedHabitId) ?? habits[0];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Calendar Overview</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your habit completions over time
          </Text>
        </View>

        {/* Habit Selector Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContainer}
        >
          {habits.map((habit) => {
            const isSelected = habit.id === selectedHabitId;
            const habitColor = habit.color ?? colors.tint;

            return (
              <TouchableOpacity
                key={habit.id}
                style={[
                  styles.habitTab,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isSelected && [styles.habitTabActive, { borderColor: habitColor, backgroundColor: colors.background }],
                ]}
                onPress={() => setSelectedHabitId(habit.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.tabDot, { backgroundColor: habitColor }]} />
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.textSecondary },
                    isSelected && [styles.tabTextActive, { color: habitColor }],
                  ]}
                >
                  {habit.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Monthly Calendar for the Selected Habit */}
        {selectedHabit && (
          <HabitMonthlyCalendar
            habitId={selectedHabit.id}
            habitDays={habitDays}
            habitColor={selectedHabit.color}
            onDayPress={(dateKey) => toggleDay(dateKey, selectedHabit.id)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.extraBold,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginTop: 4,
  },
  selectorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  habitTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 8,
  },
  habitTabActive: {
    borderWidth: 1.5,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tabText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
  },
  tabTextActive: {
    fontFamily: Fonts.bold,
  },
});