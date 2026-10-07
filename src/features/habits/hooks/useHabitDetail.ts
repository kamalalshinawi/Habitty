import { useMemo, useCallback } from 'react';
import { useHabits } from './useHabits';
import type { Habit, HabitStatus } from '../../../types/habit';
import { formatDateKey, getCurrentWeekDays, isToday, isFutureDate } from '../../../utils/dateHelpers';

export function useHabitDetail(habitId: string) {
  const {
    habits,
    habitDays,
    toggleDay: toggleHabitDay,
    getStatus,
    getStreak,
    getLongestStreak,
    getTotalCompletions,
    getCompletionRate,
  } = useHabits();

  const habit: Habit | undefined = useMemo(
    () => habits.find((h) => h.id === habitId),
    [habits, habitId]
  );

  const today = useMemo(() => new Date(), []);
  const todayDateKey = formatDateKey(today);
  const todayStatus: HabitStatus = habit ? getStatus(todayDateKey, habit.id) : 'pending';
  const isTodayDone = todayStatus === 'done';

  const streak = habit ? getStreak(habit.id) : 0;
  const longestStreak = habit ? getLongestStreak(habit.id) : 0;
  const totalCompletions = habit ? getTotalCompletions(habit.id) : 0;
  const completionRate = habit ? getCompletionRate(habit.id) : 0;

  const toggleDay = useCallback(
    (dateKey: string) => {
      if (!habit) return;
      toggleHabitDay(dateKey, habit.id);
    },
    [habit, toggleHabitDay]
  );

  const toggleToday = useCallback(() => {
    if (!habit) return;
    toggleHabitDay(todayDateKey, habit.id);
  }, [habit, todayDateKey, toggleHabitDay]);

  const getDayStatus = useCallback(
    (dateKey: string): HabitStatus => {
      if (!habit) return 'pending';
      return getStatus(dateKey, habit.id);
    },
    [habit, getStatus]
  );

  const weeklyTrend = useMemo(() => {
    if (!habit) return [];
    const weekDays = getCurrentWeekDays(today);
    return weekDays.map((w) => {
      const status = habitDays[`${w.dateKey}-${habit.id}`] ?? 'pending';
      return {
        ...w,
        status,
        isDone: status === 'done',
        isToday: isToday(w.dateKey),
        isFuture: isFutureDate(w.date),
      };
    });
  }, [habit, today, habitDays]);

  const getMonthCompletionCount = useCallback(
    (year: number, month: number): number => {
      if (!habit) return 0;
      let count = 0;
      const lastDay = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= lastDay; day++) {
        const d = new Date(year, month, day);
        const key = formatDateKey(d);
        if (habitDays[`${key}-${habit.id}`] === 'done') {
          count++;
        }
      }
      return count;
    },
    [habit, habitDays]
  );

  return {
    habit,
    todayStatus,
    isTodayDone,
    streak,
    longestStreak,
    totalCompletions,
    completionRate,
    habitDays,
    toggleDay,
    toggleToday,
    getDayStatus,
    weeklyTrend,
    getMonthCompletionCount,
    todayDateKey,
  };
}
