export type HabitStatus = 'done' | 'missed' | 'pending';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  frequency?: string;
  createdAt?: string;
}

export interface HabitDay {
  date: string; // ISO YYYY-MM-DD
  habitId: string;
  status: HabitStatus;
}

export interface CalendarDay {
  date: Date;
  dateString: string;
  status: HabitStatus;
}
