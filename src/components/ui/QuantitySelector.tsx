import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Typography } from './Typography';
import { SPACING, BORDER_RADIUS } from '../../constants/theme';
import { MAX_QUANTITY_PER_ITEM, MIN_QUANTITY } from '../../store/cartStore';
import { useTheme } from '../../contexts';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  disabled = false,
  size = 'md',
  showLabel = false,
}) => {
  const { colors } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [feedbackAnim] = useState(new Animated.Value(0));

  const canDecrease = quantity > MIN_QUANTITY;
  const canIncrease = quantity < MAX_QUANTITY_PER_ITEM;

  const triggerHapticFeedback = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateFeedback = () => {
    Animated.sequence([
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDecrease = () => {
    if (!canDecrease || disabled) return;
    
    triggerHapticFeedback();
    animatePress();
    onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (!canIncrease || disabled) return;
    
    triggerHapticFeedback();
    animatePress();
    animateFeedback();
    onQuantityChange(quantity + 1);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.containerSm,
          button: styles.buttonSm,
          display: styles.displaySm,
        };
      case 'lg':
        return {
          container: styles.containerLg,
          button: styles.buttonLg,
          display: styles.displayLg,
        };
      default:
        return {
          container: styles.containerMd,
          button: styles.buttonMd,
          display: styles.displayMd,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={styles.wrapper}>
      {showLabel && (
        <Typography variant="caption" color="secondary" style={styles.label}>
          Quantity
        </Typography>
      )}
      
      <Animated.View 
        style={[
          styles.container,
          sizeStyles.container,
          { 
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.primary
          },
          disabled && styles.containerDisabled,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            sizeStyles.button,
            { backgroundColor: colors.background.card },
            !canDecrease && { backgroundColor: colors.background.tertiary },
          ]}
          onPress={handleDecrease}
          disabled={!canDecrease || disabled}
          activeOpacity={0.7}
        >
          <Typography 
            variant={size === 'lg' ? 'h4' : 'body1'} 
            weight="bold" 
            color={canDecrease && !disabled ? 'primary' : 'tertiary'}
          >
            −
          </Typography>
        </TouchableOpacity>
        
        <Animated.View 
          style={[
            styles.display,
            sizeStyles.display,
            {
              backgroundColor: feedbackAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.background.tertiary, colors.primary[100] || colors.primary[200]],
              }),
            }
          ]}
        >
          <Typography 
            variant={size === 'lg' ? 'h4' : 'body1'} 
            weight="medium"
            color={disabled ? 'tertiary' : 'primary'}
          >
            {quantity}
          </Typography>
        </Animated.View>
        
        <TouchableOpacity
          style={[
            styles.button,
            sizeStyles.button,
            { backgroundColor: colors.background.card },
            !canIncrease && { backgroundColor: colors.background.tertiary },
          ]}
          onPress={handleIncrease}
          disabled={!canIncrease || disabled}
          activeOpacity={0.7}
        >
          <Typography 
            variant={size === 'lg' ? 'h4' : 'body1'} 
            weight="bold" 
            color={canIncrease && !disabled ? 'primary' : 'tertiary'}
          >
            +
          </Typography>
        </TouchableOpacity>
      </Animated.View>
      
      {quantity >= MAX_QUANTITY_PER_ITEM && (
        <Typography variant="caption" color="warning" style={styles.maxWarning}>
          Max quantity reached
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  
  label: {
    marginBottom: SPACING.xs,
  },
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  
  containerDisabled: {
    opacity: 0.5,
  },
  
  containerSm: {
    height: 32,
  },
  
  containerMd: {
    height: 40,
  },
  
  containerLg: {
    height: 48,
  },
  
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  
  buttonSm: {
    width: 28,
    height: 28,
    margin: 2,
  },
  
  buttonMd: {
    width: 32,
    height: 32,
    margin: 4,
  },
  
  buttonLg: {
    width: 40,
    height: 40,
    margin: 4,
  },
  
  display: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  displaySm: {
    minWidth: 32,
    paddingHorizontal: SPACING.xs,
  },
  
  displayMd: {
    minWidth: 40,
    paddingHorizontal: SPACING.sm,
  },
  
  displayLg: {
    minWidth: 48,
    paddingHorizontal: SPACING.md,
  },
  
  maxWarning: {
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});