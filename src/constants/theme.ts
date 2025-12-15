// Base color palette
const PALETTE = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  success: {
    light: '#10b981',
    dark: '#34d399',
  },
  warning: {
    light: '#f59e0b',
    dark: '#fbbf24',
  },
  error: {
    light: '#ef4444',
    dark: '#f87171',
  },
  info: {
    light: '#3b82f6',
    dark: '#60a5fa',
  },
} as const;

// Light theme colors
export const LIGHT_COLORS = {
  primary: PALETTE.primary,
  neutral: PALETTE.neutral,
  
  success: PALETTE.success.light,
  warning: PALETTE.warning.light,
  error: PALETTE.error.light,
  info: PALETTE.info.light,
  
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    card: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    placeholder: '#9ca3af',
  },
  
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    focus: '#3b82f6',
  },
} as const;

// Dark theme colors
export const DARK_COLORS = {
  primary: PALETTE.primary,
  neutral: PALETTE.neutral,
  
  success: PALETTE.success.dark,
  warning: PALETTE.warning.dark,
  error: PALETTE.error.dark,
  info: PALETTE.info.dark,
  
  background: {
    primary: '#111827',
    secondary: '#1f2937',
    tertiary: '#374151',
    card: '#1f2937',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    inverse: '#111827',
    placeholder: '#6b7280',
  },
  
  border: {
    primary: '#374151',
    secondary: '#4b5563',
    focus: '#60a5fa',
  },
} as const;

// Default to light theme (will be overridden by theme context)
export const COLORS = LIGHT_COLORS;

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

import { createShadow } from '../utils/platform';

export const SHADOWS = {
  sm: createShadow(1, '#000', 0.05),
  md: createShadow(3, '#000', 0.1),
  lg: createShadow(5, '#000', 0.15),
} as const;