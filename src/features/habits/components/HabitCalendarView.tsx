import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import type { Habit, HabitDay, HabitStatus } from '../types';
import HabitCalendar from '../../../components/ui/HabitCalendar';
import type { CalendarDay } from '../../../types/habit';

type Props = {
  habits: Habit[];
  habitDays: HabitDay[];
  onToggle: (date: string, habitId: string) => void;
};

export default function HabitCalendarView({ habits, habitDays, onToggle }: Props) {
  const [visibleHabit, setVisibleHabit] = useState(habits[0]?.id ?? '');

  const days = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 12);
    return Array.from({ length: 13 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return {
        date: d,
        dateString: iso,
        status: getDayStatus(iso, visibleHabit, habitDays),
      };
    });
  }, [visibleHabit, habitDays]);

  const visibleHabitObj = habits.find((h) => h.id === visibleHabit) ?? habits[0];

  return (
    <View style={styles.container}>
      <HabitCalendar
        days={days}
        onDayPress={(day: CalendarDay) => onToggle(day.dateString, visibleHabit)}
      />
    </View>
  );
}

function getDayStatus(
  date: string,
  habitId: string,
  habitDays: HabitDay[]
): HabitStatus {
  const entry = habitDays.find((d) => d.date === date && d.habitId === habitId);
  if (!entry) return 'pending';

  const today = new Date();
  const isToday = today.toISOString().split('T')[0] === date;
  if (isToday && entry.status === 'pending') return 'pending';
  return entry.status;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
