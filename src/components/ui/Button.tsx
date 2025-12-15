import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { createShadow } from '../../utils/platform';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
    styles[`${size}Text` as keyof typeof styles],
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.text.inverse : COLORS.primary[600]}
        />
      ) : (
        <Text style={textStyleCombined}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    ...createShadow(1, '#000', 0.05),
  },
  
  primary: {
    backgroundColor: COLORS.primary[600],
  },

  secondary: {
    backgroundColor: COLORS.neutral[100],
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary[600],
  },

  ghost: {
    backgroundColor: 'transparent',
  },
  
  sm: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    minHeight: 36,
  },

  md: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },

  lg: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minHeight: 52,
  },
  
  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: '100%',
  },
  
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },

  primaryText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.fontSize.base,
  },

  secondaryText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.fontSize.base,
  },

  outlineText: {
    color: COLORS.primary[600],
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  
  ghostText: {
    color: COLORS.primary[600],
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  
  smText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  mdText: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  lgText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  
  disabledText: {
    opacity: 0.7,
  },
});