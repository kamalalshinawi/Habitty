import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import HabitCalendarView from '../features/habits/components/HabitCalendarView';
import HabitHeader from '../features/habits/components/HabitHeader';
import { useHabits } from '../features/habits/hooks/useHabits';
import { DUMMY_HABITS, getDummyHabitDays } from '../constants/dummyData';

export default function HomeScreen() {
  const { habitDays, toggleDay, getStatus } = useHabits();

  const today = new Date();
  const daysWithData = React.useMemo(
    () => getDummyHabitDays(DUMMY_HABITS, today),
    [today]
  );

  const firstHabit = DUMMY_HABITS[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HabitHeader habit={firstHabit} />

        <View style={styles.calendarContainer}>
          <HabitCalendarView
            habits={DUMMY_HABITS}
            habitDays={daysWithData}
            onToggle={toggleDay}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  calendarContainer: {
    paddingHorizontal: 8,
  },
});
