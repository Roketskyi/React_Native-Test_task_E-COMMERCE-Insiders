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
import { useTheme } from '../../contexts/ThemeContext';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'info' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

const WebButton: React.FC<ButtonProps & { buttonStyle: ViewStyle; textColor: string; textSize: number }> = ({
  title,
  onPress,
  disabled,
  loading,
  buttonStyle,
  textColor,
  textSize,
  variant,
  icon,
  iconPosition = 'left',
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  if (Platform.OS === 'web') {
    const getGradientBackground = () => {
      switch (variant) {
        case 'danger':
          return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        case 'success':
          return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        case 'info':
          return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        case 'subtle':
          return String(buttonStyle.backgroundColor || '#f3f4f6');
        default:
          return String(buttonStyle.backgroundColor || '#3b82f6');
      }
    };

    const getBoxShadow = () => {
      if (disabled || loading) return 'none';
      
      switch (variant) {
        case 'danger':
          return '0 4px 14px 0 rgba(239, 68, 68, 0.3), 0 2px 4px 0 rgba(239, 68, 68, 0.1)';
        case 'success':
          return '0 4px 14px 0 rgba(16, 185, 129, 0.3), 0 2px 4px 0 rgba(16, 185, 129, 0.1)';
        case 'info':
          return '0 4px 14px 0 rgba(59, 130, 246, 0.3), 0 2px 4px 0 rgba(59, 130, 246, 0.1)';
        case 'subtle':
          return '0 2px 8px 0 rgba(0, 0, 0, 0.1)';
        default:
          return 'none';
      }
    };

    return (
      <div
        onClick={handlePress}
        style={{
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: getGradientBackground(),
          border: buttonStyle.borderWidth ? `${buttonStyle.borderWidth}px solid ${String(buttonStyle.borderColor || '#e5e7eb')}` : 'none',
          borderRadius: `${buttonStyle.borderRadius || 0}px`,
          padding: `${buttonStyle.paddingVertical || 0}px ${buttonStyle.paddingHorizontal || 0}px`,
          minHeight: `${buttonStyle.minHeight || 44}px`,
          width: buttonStyle.width === '100%' ? '100%' : 'auto',
          opacity: disabled || loading ? 0.5 : 1,
          transition: 'all 0.2s ease',
          boxShadow: getBoxShadow(),
          transform: disabled || loading ? 'none' : 'translateY(0px)',
        }}
        data-button-variant={variant}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = getBoxShadow().replace('0.3)', '0.4)').replace('0.1)', '0.2)');
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = getBoxShadow();
          }
        }}
      >
        {loading ? (
          <div
            style={{
              width: '20px',
              height: '20px',
              border: `2px solid ${textColor}`,
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && iconPosition === 'left' && (
              <span style={{ fontSize: `${textSize}px` }}>{icon}</span>
            )}
            <span
              style={{
                color: textColor,
                fontSize: `${textSize}px`,
                fontFamily: TYPOGRAPHY.fontFamily.medium,
                textAlign: 'center',
                background: 'transparent',
                backgroundColor: 'transparent',
                backgroundImage: 'none',
                fontWeight: ['danger', 'success', 'info'].includes(variant || '') ? '600' : '500',
              }}
            >
              {title}
            </span>

            {icon && iconPosition === 'right' && (
              <span style={{ fontSize: `${textSize}px` }}>{icon}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

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
  icon,
  iconPosition = 'left',
}) => {
  const { colors } = useTheme();

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const styleId = 'button-spinner-animation';

      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');

        style.id = styleId;
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;

        document.head.appendChild(style);
      }
    }
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
      case 'danger':
        return { 
          ...baseStyle, 
          backgroundColor: colors.error,
          ...createShadow(2, colors.error, 0.3),
        };
      case 'success':
        return { 
          ...baseStyle, 
          backgroundColor: colors.success,
          ...createShadow(2, colors.success, 0.3),
        };
      case 'info':
        return { 
          ...baseStyle, 
          backgroundColor: colors.primary[500],
          ...createShadow(2, colors.primary[500], 0.3),
        };
      case 'subtle':
        return { 
          ...baseStyle, 
          backgroundColor: colors.background.card,
          borderWidth: 1,
          borderColor: colors.border.secondary,
          ...createShadow(1, '#000', 0.1),
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.text.inverse;
      case 'secondary':
        return colors.text.primary;
      case 'outline':
        return colors.primary[600];
      case 'ghost':
        return colors.primary[600];
      case 'danger':
        return colors.text.inverse;
      case 'success':
        return colors.text.inverse;
      case 'info':
        return colors.text.inverse;
      case 'subtle':
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return TYPOGRAPHY.fontSize.sm;
      case 'md':
        return TYPOGRAPHY.fontSize.base;
      case 'lg':
        return TYPOGRAPHY.fontSize.lg;
      default:
        return TYPOGRAPHY.fontSize.base;
    }
  };

  const buttonStyle = [
    getButtonStyle(),
    
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textColor = getTextColor();
  const textSize = getTextSize();

  if (Platform.OS === 'web') {
    const webButtonProps: ButtonProps & { buttonStyle: ViewStyle; textColor: string; textSize: number } = {
      title,
      onPress,
      variant,
      size,
      disabled,
      loading,
      fullWidth,
      buttonStyle: StyleSheet.flatten(buttonStyle),
      textColor,
      textSize,
      iconPosition,
      ...(style && { style }),
      ...(textStyle && { textStyle }),
      ...(icon && { icon }),
    };
    
    return <WebButton {...webButtonProps} />;
  }

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
          color={textColor}
        />
      ) : (
        <Text 
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: textSize,
              backgroundColor: 'transparent',
            },

            textStyle,
          ]}
        >
          {icon && iconPosition === 'left' && `${icon} `}
          {title}
          {icon && iconPosition === 'right' && ` ${icon}`}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,

    ...createShadow(2, '#000', 0.1),
  },
  
  sm: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    minHeight: 40,
  },

  md: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },

  lg: {
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
    minHeight: 56,
  },
  
  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: '100%',
  },
  
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});