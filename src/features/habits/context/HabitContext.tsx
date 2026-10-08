import React from 'react';
import { useHabits } from '../hooks/useHabits';

export { useHabits as useHabitsContext, useHabits };

export function HabitProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
