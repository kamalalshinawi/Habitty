import React, { createContext, useContext, useState } from 'react';
import { Colors } from '../constants/colors';

export type ThemeMode = 'light' | 'dark';

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

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        toggleTheme,
        setThemeMode,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
