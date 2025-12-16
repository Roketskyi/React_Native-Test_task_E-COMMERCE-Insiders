import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { createShadow } from '../../utils/platform';

interface AnimatedButtonProps {
  onPress: () => void;

  title: string;
  isInCart: boolean;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  onPress, 
  title, 
  isInCart, 
  disabled = false 
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 400,
        friction: 8,
      }),

      Animated.timing(opacityAnim, {
        toValue: 0.85,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 400,
        friction: 8,
      }),
      
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        isInCart && styles.buttonActive,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Animated.View
        style={[
          styles.buttonContent,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={[
          styles.buttonText,
          isInCart && styles.buttonTextActive,
          disabled && styles.buttonTextDisabled,
        ]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary[600],
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...createShadow(2, COLORS.primary[600], 0.3),
  },
  
  buttonActive: {
    backgroundColor: COLORS.success,
  },
  
  buttonDisabled: {
    backgroundColor: COLORS.neutral[300],
    ...createShadow(0, '#000', 0),
  },
  
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.text.inverse,
  },
  
  buttonTextActive: {
    color: COLORS.text.inverse,
  },
  
  buttonTextDisabled: {
    color: COLORS.text.tertiary,
  },
});