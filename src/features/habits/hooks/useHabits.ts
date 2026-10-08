import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  toggleDay as toggleDayAction,
  addHabit as addHabitAction,
  deleteHabit as deleteHabitAction,
} from '../habitSlice';
import type { Habit, HabitStatus } from '../../../types/habit';
import { formatDateKey } from '../../../utils/dateHelpers';

export function useHabits() {
  const dispatch = useAppDispatch();
  const habits = useAppSelector((state) => state.habits.habits);
  const habitDays = useAppSelector((state) => state.habits.habitDays);

  const toggleDay = useCallback(
    (date: string, habitId: string) => {
      dispatch(toggleDayAction({ date, habitId }));
    },
    [dispatch]
  );

  const getStatus = useCallback(
    (date: string, habitId: string): HabitStatus => {
      return habitDays[`${date}-${habitId}`] ?? 'pending';
    },
    [habitDays]
  );

  const getStreak = useCallback(
    (habitId: string): number => {
      const today = new Date();
      const todayStr = formatDateKey(today);
      const todayDone = habitDays[`${todayStr}-${habitId}`] === 'done';

      let streak = 0;
      const current = new Date(today);

      if (todayDone) {
        streak = 1;
        current.setDate(current.getDate() - 1);
      } else {
        current.setDate(current.getDate() - 1);
      }

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
    },
    [habitDays]
  );

  const getLongestStreak = useCallback(
    (habitId: string): number => {
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
    },
    [habitDays, getStreak]
  );

  const getTotalCompletions = useCallback(
    (habitId: string): number => {
      return Object.entries(habitDays).filter(
        ([key, status]) => key.endsWith(`-${habitId}`) && status === 'done'
      ).length;
    },
    [habitDays]
  );

  const getCompletionRate = useCallback(
    (habitId: string): number => {
      const completions = getTotalCompletions(habitId);
      const daysTracked = Object.keys(habitDays).filter((k) =>
        k.endsWith(`-${habitId}`)
      ).length;
      return daysTracked > 0 ? completions / daysTracked : 0;
    },
    [habitDays, getTotalCompletions]
  );

  const todayCompleted = useMemo(() => {
    const todayStr = formatDateKey(new Date());
    return habits.filter((h) => habitDays[`${todayStr}-${h.id}`] === 'done').length;
  }, [habits, habitDays]);

  const addHabit = useCallback(
    (habit: Habit) => {
      dispatch(addHabitAction(habit));
    },
    [dispatch]
  );

  const deleteHabit = useCallback(
    (habitId: string) => {
      dispatch(deleteHabitAction(habitId));
    },
    [dispatch]
  );

  return {
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
