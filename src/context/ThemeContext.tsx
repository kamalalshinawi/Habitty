import React from 'react';
import { Colors } from '../constants/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  toggleTheme as toggleThemeAction,
  setThemeMode as setThemeModeAction,
  type ThemeMode,
} from '../features/theme/themeSlice';

export type { ThemeMode };

export interface ThemeColors {
  background: string;
  card: string;
  cardSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  tint: string;
  tintDark: string;
  success: string;
  warning: string;
  danger: string;
  habitColors: typeof Colors.habitColors;
}

export const lightColors: ThemeColors = {
  background: '#ffffff',
  card: '#f8fafc',
  cardSecondary: '#f1f5f9',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  tint: '#3b82f6',
  tintDark: '#60a5fa',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  habitColors: Colors.habitColors,
};

export const darkColors: ThemeColors = {
  background: '#0f172a',
  card: '#1e293b',
  cardSecondary: '#334155',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#334155',
  tint: '#60a5fa',
  tintDark: '#60a5fa',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  habitColors: Colors.habitColors,
};

export function useTheme() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.themeMode);
  const isDark = themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  const setThemeMode = (mode: ThemeMode) => {
    dispatch(setThemeModeAction(mode));
  };

  return {
    themeMode,
    isDark,
    toggleTheme,
    setThemeMode,
    colors,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
