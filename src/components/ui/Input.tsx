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
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useTheme } from '../../contexts';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | undefined;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  style?: ViewStyle;
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
  style,
  variant = 'outlined',
  size = 'md',
  required = false,
  secureTextEntry,
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const containerStyles = [
    styles.container,
    containerStyle,
    style,
  ];

  const getInputContainerStyle = () => {
    const baseStyle = {
      ...styles.inputContainer,
      ...styles[size],
    };

    if (variant === 'outlined') {
      return {
        ...baseStyle,
        borderWidth: isFocused ? 2 : 1,
        borderColor: error ? colors.error : (isFocused ? colors.border.focus : colors.border.primary),
        backgroundColor: colors.background.primary,
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: colors.background.tertiary,
        borderWidth: 0,
      };
    }
  };

  const inputStyles = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles],
    { color: colors.text.primary },
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
          <Text style={[styles.label, { color: colors.text.primary }]}>
            {label}
            {required && <Text style={[styles.required, { color: colors.error }]}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={getInputContainerStyle()}>
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
          placeholderTextColor={colors.text.placeholder}
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
        <Text style={[
          styles.helperText, 
          { color: error ? colors.error : colors.text.secondary }
        ]}>
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
  },
  
  required: {
    // Color will be set dynamically
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
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
  
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
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
    marginTop: SPACING.xs,
  },
});