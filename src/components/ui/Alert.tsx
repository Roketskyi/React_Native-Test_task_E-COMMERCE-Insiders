import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../contexts';
import { Button } from './Button';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  dismissOnBackdropPress?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onDismiss,
  dismissOnBackdropPress = true,
}) => {
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress && onDismiss) {
      onDismiss();
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const getButtonVariant = (style?: string) => {
    switch (style) {
      case 'destructive':
        return 'danger';
      case 'cancel':
        return 'ghost';
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View 
          style={[
            styles.backdrop,
            { 
              backgroundColor: colors.background.overlay,
              opacity: opacityAnim,
            }
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.alertContainer,
                {
                  backgroundColor: colors.background.card,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                  {title}
                </Text>
                
                {message && (
                  <Text style={[styles.message, { color: colors.text.secondary }]}>
                    {message}
                  </Text>
                )}
              </View>

              <View style={[
                styles.buttonContainer,
                buttons.length > 2 && styles.multiButtonContainer
              ]}>
                {(buttons.length <= 2 
                  ? buttons.sort((a, b) => {
                      // Sort buttons: cancel first, then default, then destructive (only for 2 or fewer buttons)
                      if (a.style === 'cancel') return -1;
                      if (b.style === 'cancel') return 1;
                      if (a.style === 'destructive') return 1;
                      if (b.style === 'destructive') return -1;
                      return 0;
                    })
                  : buttons // Don't sort if more than 2 buttons (like theme selection)
                ).map((button, index) => {
                    const isCancel = button.style === 'cancel';
                    const isDestructive = button.style === 'destructive';
                    const isPrimary = !isCancel && !isDestructive;
                    const isMultiButton = buttons.length > 2;
                    
                    return (
                      <Button
                        key={`${button.text}-${index}`}
                        title={button.text}
                        onPress={() => handleButtonPress(button)}
                        variant={getButtonVariant(button.style)}
                        size={isCancel && !isMultiButton ? 'sm' : 'md'}
                        {...(isCancel && !isMultiButton && { icon: '✕', iconPosition: 'left' as const })}
                        {...(isDestructive && !isMultiButton && { icon: '⚠️', iconPosition: 'left' as const })}
                        style={StyleSheet.flatten([
                          isMultiButton 
                            ? (isCancel ? styles.multiCancelButton : styles.multiButton)
                            : (isCancel ? styles.cancelButton : styles.button),
                          index < buttons.length - 1 && styles.buttonMargin,
                          !isMultiButton && isDestructive && styles.destructiveButton,
                          !isMultiButton && isPrimary && styles.primaryButton,
                        ])}
                      />
                    );
                  })}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  alertContainer: {
    width: Math.min(screenWidth - SPACING.xl * 2, 320),
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  
  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingTop: 0,
    gap: SPACING.sm,
  },
  
  multiButtonContainer: {
    flexDirection: 'column',
    gap: SPACING.xs,
  },
  
  button: {
    flex: 1,
  },
  
  buttonMargin: {
    marginRight: SPACING.sm,
  },
  
  cancelButton: {
    flex: 0.8, // Smaller than other buttons
    minWidth: 80,
  },
  
  destructiveButton: {
    flex: 1.2, // Slightly larger for emphasis
  },
  
  primaryButton: {
    flex: 1,
  },
  
  multiButton: {
    width: '100%',
    marginBottom: 0,
  },
  
  multiCancelButton: {
    width: '100%',
    marginBottom: 0,
  },
});