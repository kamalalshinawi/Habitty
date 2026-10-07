import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useHabits } from '../features/habits/hooks/useHabits';
import HabitMonthlyCalendar from '../components/ui/HabitMonthlyCalendar';

export default function CalendarScreen() {
  const { habits, habitDays, toggleDay } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string>(
    habits[0]?.id ?? '1'
  );

  const selectedHabit = habits.find((h) => h.id === selectedHabitId) ?? habits[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar Overview</Text>
          <Text style={styles.subtitle}>Track your habit completions over time</Text>
        </View>

        {/* Habit Selector Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContainer}
        >
          {habits.map((habit) => {
            const isSelected = habit.id === selectedHabitId;
            const habitColor = habit.color ?? Colors.tint;

            return (
              <TouchableOpacity
                key={habit.id}
                style={[
                  styles.habitTab,
                  isSelected && [styles.habitTabActive, { borderColor: habitColor }],
                ]}
                onPress={() => setSelectedHabitId(habit.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.tabDot, { backgroundColor: habitColor }]} />
                <Text
                  style={[
                    styles.tabText,
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
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 8,
  },
  habitTabActive: {
    backgroundColor: Colors.background,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    fontWeight: '700',
  },
});