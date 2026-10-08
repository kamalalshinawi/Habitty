import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Habit, HabitStatus } from '../../types/habit';
import { DUMMY_HABITS, getInitialHabitDaysRecord } from '../../constants/dummyData';
import { formatDateKey } from '../../utils/dateHelpers';

export interface HabitState {
  habits: Habit[];
  habitDays: Record<string, HabitStatus>;
}

const initialState: HabitState = {
  habits: DUMMY_HABITS,
  habitDays: getInitialHabitDaysRecord(),
};

export const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    toggleDay: (
      state,
      action: PayloadAction<{ date: string; habitId: string }>
    ) => {
      const { date, habitId } = action.payload;
      const key = `${date}-${habitId}`;
      const current = state.habitDays[key] ?? 'pending';
      state.habitDays[key] = current === 'done' ? 'pending' : 'done';
    },
    setDayStatus: (
      state,
      action: PayloadAction<{ date: string; habitId: string; status: HabitStatus }>
    ) => {
      const { date, habitId, status } = action.payload;
      state.habitDays[`${date}-${habitId}`] = status;
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.habits.push(action.payload);
      const todayStr = formatDateKey(new Date());
      state.habitDays[`${todayStr}-${action.payload.id}`] = 'pending';
    },
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter((h) => h.id !== action.payload);
      // Clean up records for deleted habit
      Object.keys(state.habitDays).forEach((key) => {
        if (key.endsWith(`-${action.payload}`)) {
          delete state.habitDays[key];
        }
      });
    },
    resetHabits: () => initialState,
  },
});

export const {
  toggleDay,
  setDayStatus,
  addHabit,
  deleteHabit,
  resetHabits,
} = habitSlice.actions;

export default habitSlice.reducer;
