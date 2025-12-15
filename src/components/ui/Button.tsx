import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { createShadow } from '../../utils/platform';
import { useTheme } from '../../contexts';

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
  const { colors } = useTheme();
  
  // Web-specific fix: inject CSS to override background
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const styleId = 'button-text-fix';
      let style = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          /* React Native Web Button Text Fix - Highest Priority */
          div[data-button-variant] span,
          div[data-focusable="true"] span,
          div[role="button"] span,
          span[data-button-text="true"],
          span[id*="button-text"] {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            -webkit-background-clip: border-box !important;
          }
          
          /* Force all nested elements */
          div[data-button-variant] *,
          div[data-focusable="true"] *,
          div[role="button"] * {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
    return undefined;
  }, []);
  
  const getButtonStyle = () => {
    const baseStyle = {
      ...styles.base,
      ...styles[size],
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: colors.primary[600] };
      case 'secondary':
        return { ...baseStyle, backgroundColor: colors.background.tertiary };
      case 'outline':
        return { 
          ...baseStyle, 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border.primary,
        };
      case 'ghost':
        return { 
          ...baseStyle, 
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      ...styles.text,
      ...styles[`${size}Text` as keyof typeof styles],
    };

    switch (variant) {
      case 'primary':
        return { ...baseTextStyle, color: colors.text.inverse };
      case 'secondary':
        return { ...baseTextStyle, color: colors.text.primary };
      case 'outline':
        return { ...baseTextStyle, color: colors.primary[600] };
      case 'ghost':
        return { ...baseTextStyle, color: colors.primary[600] };
      default:
        return baseTextStyle;
    }
  };

  const buttonStyle = [
    getButtonStyle(),
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    getTextStyle(),
    (disabled || loading) && styles.disabledText,
    textStyle,
    // Force transparent background for web
    Platform.OS === 'web' && {
      backgroundColor: 'transparent',
      background: 'transparent',
    }
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...(Platform.OS === 'web' && {
        // Add custom attribute for CSS targeting
        'data-button-variant': variant,
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.text.inverse : colors.primary[600]}
        />
      ) : (
        <Text 
          style={[
            textStyleCombined, 
            { 
              backgroundColor: 'transparent',
            }
          ]}
          {...(Platform.OS === 'web' && {
            'data-button-text': 'true',
            // Force style attribute for web
            nativeID: `button-text-${variant}-${Math.random()}`,
          })}
        >
          {title}
        </Text>
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
    ...(Platform.OS === 'web' && {
      // Force transparent background on web
      backgroundColor: 'transparent',
    }),
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
    backgroundColor: 'transparent', // Fix for white background bug
    ...(Platform.OS === 'web' && {
      // Additional web-specific fixes
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'inherit',
      background: 'transparent !important',
    }),
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