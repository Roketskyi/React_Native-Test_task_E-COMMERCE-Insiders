import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { createShadow } from '../../utils/platform';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  variant?: 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  variant = 'outlined',
  size = 'md',
  required = false,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles],
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    inputStyle,
  ] as any;

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={containerStyles}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          placeholderTextColor={COLORS.text.tertiary}
          {...textInputProps}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={secureTextEntry ? toggleSecureEntry : undefined}
            disabled={!secureTextEntry}
          >
            {secureTextEntry ? (
              <Text style={styles.eyeIcon}>{isSecure ? '👁️' : '🙈'}</Text>
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  
  labelContainer: {
    marginBottom: SPACING.xs,
  },
  
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
  },
  
  required: {
    color: COLORS.error,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    backgroundColor: COLORS.background.primary,
  },
  
  filled: {
    backgroundColor: COLORS.neutral[100],
    borderWidth: 0,
  },
  
  sm: {
    minHeight: 36,
    paddingHorizontal: SPACING.sm,
  },
  
  md: {
    minHeight: 44,
    paddingHorizontal: SPACING.md,
  },
  
  lg: {
    minHeight: 52,
    paddingHorizontal: SPACING.lg,
  },
  
  focused: {
    borderColor: COLORS.primary[600],
    borderWidth: 2,
    backgroundColor: COLORS.background.primary,
    ...createShadow(1, COLORS.primary[600], 0.1),
  },
  
  error: {
    borderColor: COLORS.error,
  },
  
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.primary,
  },
  
  smInput: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  
  mdInput: {
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  
  lgInput: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  
  inputWithLeftIcon: {
    marginLeft: SPACING.xs,
  },
  
  inputWithRightIcon: {
    marginRight: SPACING.xs,
  },
  
  leftIconContainer: {
    marginRight: SPACING.xs,
  },
  
  rightIconContainer: {
    marginLeft: SPACING.xs,
    padding: SPACING.xs,
  },
  
  eyeIcon: {
    fontSize: 16,
  },
  
  helperText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  
  errorText: {
    color: COLORS.error,
  },
});