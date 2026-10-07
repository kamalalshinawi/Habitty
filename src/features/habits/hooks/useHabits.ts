import { useMemo } from 'react';
import type { Habit } from '../types';
import { useHabitsContext } from '../context/HabitContext';

export function useHabits() {
  return useHabitsContext();
}

export function useCalendarDays(habits: Habit[], currentDate: Date) {
  return useMemo(() => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - 9);
    for (let i = 0; i < 10; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({
        date: d.toISOString().split('T')[0],
        dateObj: d,
      });
    }
    return days;
  }, [currentDate]);
}
