import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBiometric } from '../hooks/useBiometric';
import { useAuthStore } from '../store/authStore';
import { Typography } from './ui';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, BORDER_RADIUS } from '../constants/theme';

interface BiometricLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  style?: any;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({
  onSuccess,
  onError,
  style
}) => {
  const { colors } = useTheme();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { isAvailable, getBiometricTypeName, authenticate } = useBiometric();
  const { user, login } = useAuthStore();

  const handleBiometricAuth = async () => {
    if (!isAvailable) {
      onError?.('Biometric authentication is not available');
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await authenticate({
        promptMessage: `Sign in with ${getBiometricTypeName()}`,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password'
      });

      if (result.success) {
        if (user) {
          await login(user, 'biometric_token');

          onSuccess?.();
        } else {
          const demoUser = {
            id: 1,
            email: 'john@gmail.com',
            username: 'mor_2314',
            password: '83r5^_',
            name: {
              firstname: 'John',
              lastname: 'Doe'
            },

            address: {
              city: 'kilcoole',
              street: '7835 new road',
              number: 3,
              zipcode: '12926-3874',
              geolocation: {
                lat: '-37.3159',
                long: '81.1496'
              }
            },

            phone: '1-570-236-7033'
          };
          
          await login(demoUser, 'biometric_demo_token');
          onSuccess?.();
        }
      } else {
        onError?.(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);

      onError?.('Authentication failed due to an unexpected error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isAvailable) {
    return null;
  }

  const biometricType = getBiometricTypeName();
  const icon = biometricType.includes('Face') ? 'face-recognition' : 'finger-print';

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.biometricButton,
          { 
            backgroundColor: colors.background.card,
            borderColor: colors.border.primary 
          }
        ]}
        onPress={handleBiometricAuth}
        disabled={isAuthenticating}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon as any}
          size={32}
          color={colors.text.primary}
          style={styles.icon}
        />
        
        <Typography variant="body2" color="primary" align="center">
          {isAuthenticating ? 'Authenticating...' : `Sign in with ${biometricType}`}
        </Typography>
      </TouchableOpacity>

      <Typography variant="caption" color="secondary" align="center" style={styles.hint}>
        {user 
          ? `Touch the ${biometricType.toLowerCase()} sensor to authenticate`
          : `Touch the ${biometricType.toLowerCase()} sensor to sign in with demo account`
        }
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  
  biometricButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    minWidth: 200,
    minHeight: 100,
  },
  
  icon: {
    marginBottom: SPACING.sm,
  },
  
  hint: {
    marginTop: SPACING.sm,
    maxWidth: 200,
  },
});