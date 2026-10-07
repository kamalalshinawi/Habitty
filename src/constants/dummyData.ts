import { Habit, HabitDay } from '../types/habit';

export const DUMMY_HABITS: Habit[] = [
  { id: '1', title: 'Drink water', description: '8 glasses a day', color: '#3b82f6' },
  { id: '2', title: 'Morning run', description: '30 min exercise', color: '#22c55e' },
  { id: '3', title: 'Read', description: '20 pages', color: '#f59e0b' },
  { id: '4', title: 'Meditate', description: '10 min mindfulness', color: '#8b5cf6' },
];

export function getDummyHabitDays(habits: Habit[], currentDate: Date): HabitDay[] {
  const days: HabitDay[] = [];
  const today = new Date(currentDate);
  for (let i = -9; i <= 0; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateString = d.toISOString().split('T')[0];
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
