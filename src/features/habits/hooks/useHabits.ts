import { useMemo, useState } from 'react';
import type { Habit, HabitDay, HabitStatus } from '../types';
import { DUMMY_HABITS } from '../../../constants/dummyData';

const HABIT_COLORS = DUMMY_HABITS;

export function useHabits() {
  const [habits] = useState<Habit[]>(HABIT_COLORS);
  const [habitDays, setHabitDays] = useState<Record<string, HabitStatus>>({});

  const toggleDay = (date: string, habitId: string) => {
    const key = `${date}-${habitId}`;
    setHabitDays((prev) => {
      const current = prev[key] ?? 'pending';
      const next: HabitStatus = current === 'done' ? 'missed' : 'done';
      return { ...prev, [key]: next };
    });
  };

  const getStatus = (date: string, habitId: string) => {
    return habitDays[`${date}-${habitId}`] ?? 'pending';
  };

  return {
    habits,
    habitDays,
    toggleDay,
    getStatus,
  };
}

export function useCalendarDays(habits: Habit[], currentDate: Date) {
  return useMemo(() => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - 9);
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
