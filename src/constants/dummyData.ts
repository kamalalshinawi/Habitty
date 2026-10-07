import { Habit, HabitDay, HabitStatus } from '../types/habit';
import { formatDateKey } from '../utils/dateHelpers';

export const DUMMY_HABITS: Habit[] = [
  { id: '1', title: 'Drink water', description: '8 glasses a day', color: '#3b82f6' },
  { id: '2', title: 'Morning run', description: '30 min exercise', color: '#22c55e' },
  { id: '3', title: 'Read', description: '20 pages', color: '#f59e0b' },
  { id: '4', title: 'Meditate', description: '10 min mindfulness', color: '#8b5cf6' },
];

export function getInitialHabitDaysRecord(): Record<string, HabitStatus> {
  const record: Record<string, HabitStatus> = {};
  const today = new Date();

  // Seed data for the past 40 days
  for (let i = 1; i <= 40; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = formatDateKey(d);

    // Habit 1: Drink water (recent 5 days done, high consistency)
    if (i <= 5) {
      record[`${dateKey}-1`] = 'done';
    } else if (i === 6) {
      record[`${dateKey}-1`] = 'missed';
    } else {
      record[`${dateKey}-1`] = (i % 7 !== 2) ? 'done' : 'missed';
    }

    // Habit 2: Morning run (recent 3 days done)
    if (i <= 3) {
      record[`${dateKey}-2`] = 'done';
    } else if (i === 4) {
      record[`${dateKey}-2`] = 'missed';
    } else {
      record[`${dateKey}-2`] = (i % 3 !== 0) ? 'done' : 'missed';
    }

    // Habit 3: Read (recent 4 days done)
    if (i <= 4) {
      record[`${dateKey}-3`] = 'done';
    } else if (i === 5) {
      record[`${dateKey}-3`] = 'missed';
    } else {
      record[`${dateKey}-3`] = (i % 4 !== 1) ? 'done' : 'missed';
    }

    // Habit 4: Meditate (recent 6 days done)
    if (i <= 6) {
      record[`${dateKey}-4`] = 'done';
    } else if (i === 7) {
      record[`${dateKey}-4`] = 'missed';
    } else {
      record[`${dateKey}-4`] = (i % 5 !== 3) ? 'done' : 'missed';
    }
  }

  // Today is pending initially or partially done for nice demo feel
  const todayKey = formatDateKey(today);
  record[`${todayKey}-1`] = 'pending';
  record[`${todayKey}-2`] = 'pending';
  record[`${todayKey}-3`] = 'pending';
  record[`${todayKey}-4`] = 'pending';

  return record;
}

export function getDummyHabitDays(habits: Habit[], currentDate: Date): HabitDay[] {
  const days: HabitDay[] = [];
  const today = new Date(currentDate);
  for (let i = -9; i <= 0; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateString = formatDateKey(d);
    habits.forEach((habit) => {
      days.push({
        date: dateString,
        habitId: habit.id,
        status: i === 0 ? 'pending' : Math.random() > 0.3 ? 'done' : 'missed',
      });
    });
  }
  return days;
}
