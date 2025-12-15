import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  colors: typeof LIGHT_COLORS;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Determine actual color scheme based on mode
  const colorScheme: ColorScheme = themeMode === 'system' 
    ? (systemColorScheme || 'light')
    : themeMode;

  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const contextValue: ThemeContextType = {
    mode: themeMode,
    colorScheme,
    colors,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}