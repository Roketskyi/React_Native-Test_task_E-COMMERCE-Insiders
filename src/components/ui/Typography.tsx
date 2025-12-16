import React from 'react';
import { Text, TextStyle, StyleSheet, Platform } from 'react-native';
import { TYPOGRAPHY } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  style?: TextStyle;
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight = 'regular',
  style,
  numberOfLines,
}) => {
  const { colors } = useTheme();
  
  const getColorStyle = () => {
    switch (color) {
      case 'primary':
        return { color: colors.text.primary };
      case 'secondary':
        return { color: colors.text.secondary };
      case 'tertiary':
        return { color: colors.text.tertiary };
      case 'inverse':
        return { color: colors.text.inverse };
      case 'success':
        return { color: colors.success };
      case 'warning':
        return { color: colors.warning };
      case 'error':
        return { color: colors.error };
      default:
        return { color: colors.text.primary };
    }
  };

  const textStyle = [
    styles.base,
    styles[variant],
    getColorStyle(),
    styles[`${align}Align` as keyof typeof styles],
    styles[`${weight}Weight` as keyof typeof styles],
    style,
  ];

  return (
    <Text style={textStyle} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && {
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'inherit',
      background: 'transparent !important',
    }),
  },
  
  h1: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    lineHeight: TYPOGRAPHY.lineHeight['4xl'],
  },

  h2: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    lineHeight: TYPOGRAPHY.lineHeight['3xl'],
  },

  h3: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    lineHeight: TYPOGRAPHY.lineHeight['2xl'],
  },

  h4: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    lineHeight: TYPOGRAPHY.lineHeight.xl,
  },

  body1: {
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },

  body2: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },

  caption: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
  },

  overline: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.lineHeight.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  leftAlign: {
    textAlign: 'left',
  },

  centerAlign: {
    textAlign: 'center',
  },

  rightAlign: {
    textAlign: 'right',
  },
  
  regularWeight: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  
  mediumWeight: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },

  semiboldWeight: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
  },

  boldWeight: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});