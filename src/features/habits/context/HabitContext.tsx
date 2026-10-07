import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Habit, HabitStatus } from '../../../types/habit';
import { DUMMY_HABITS, getInitialHabitDaysRecord } from '../../../constants/dummyData';
import { formatDateKey } from '../../../utils/dateHelpers';

interface HabitContextType {
  habits: Habit[];
  habitDays: Record<string, HabitStatus>;
  toggleDay: (date: string, habitId: string) => void;
  getStatus: (date: string, habitId: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
  getTotalCompletions: (habitId: string) => number;
  getCompletionRate: (habitId: string) => number;
  todayCompleted: number;
  addHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(DUMMY_HABITS);
  const [habitDays, setHabitDays] = useState<Record<string, HabitStatus>>(() => getInitialHabitDaysRecord());

  const toggleDay = (date: string, habitId: string) => {
    const key = `${date}-${habitId}`;
    setHabitDays((prev) => {
      const current = prev[key] ?? 'pending';
      const next: HabitStatus = current === 'done' ? 'pending' : 'done';
      return { ...prev, [key]: next };
    });
  };

  const getStatus = (date: string, habitId: string): HabitStatus => {
    return habitDays[`${date}-${habitId}`] ?? 'pending';
  };

  const getStreak = (habitId: string): number => {
    const today = new Date();
    const todayStr = formatDateKey(today);
    const todayDone = habitDays[`${todayStr}-${habitId}`] === 'done';

    let streak = 0;
    const current = new Date(today);

    // If today is completed, start counting from today
    // If today is pending, start checking from yesterday so existing streak is not broken
    if (todayDone) {
      streak = 1;
      current.setDate(current.getDate() - 1);
    } else {
      current.setDate(current.getDate() - 1);
    }

    // Count backwards
    for (let i = 0; i < 365; i++) {
      const dateStr = formatDateKey(current);
      const status = habitDays[`${dateStr}-${habitId}`];
      if (status === 'done') {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getLongestStreak = (habitId: string): number => {
    let longest = 0;
    let current = 0;
    const date = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = formatDateKey(date);
      const status = habitDays[`${dateStr}-${habitId}`];
      if (status === 'done') {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
      date.setDate(date.getDate() - 1);
    }
    return Math.max(longest, getStreak(habitId));
  };

  const getTotalCompletions = (habitId: string): number => {
    return Object.entries(habitDays).filter(
      ([key, status]) => key.endsWith(`-${habitId}`) && status === 'done'
    ).length;
  };

  const getCompletionRate = (habitId: string): number => {
    const completions = getTotalCompletions(habitId);
    const daysTracked = Object.keys(habitDays).filter((k) =>
      k.endsWith(`-${habitId}`)
    ).length;
    return daysTracked > 0 ? completions / daysTracked : 0;
  };

  const todayCompleted = useMemo(() => {
    const todayStr = formatDateKey(new Date());
    return habits.filter((h) => habitDays[`${todayStr}-${h.id}`] === 'done').length;
  }, [habits, habitDays]);

  const addHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
    const todayStr = formatDateKey(new Date());
    setHabitDays((prev) => ({
      ...prev,
      [`${todayStr}-${habit.id}`]: 'pending',
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const value = {
    habits,
    habitDays,
    toggleDay,
    getStatus,
    getStreak,
    getLongestStreak,
    getTotalCompletions,
    getCompletionRate,
    todayCompleted,
    addHabit,
    deleteHabit,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabitsContext() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabitsContext must be used within a HabitProvider');
  }
  return context;
}
