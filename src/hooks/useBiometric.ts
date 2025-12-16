import { useState, useEffect } from 'react';
import { BiometricService, BiometricResult } from '../services/biometricService';
import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricState {
  isAvailable: boolean;
  isEnrolled: boolean;
  hasHardware: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  isLoading: boolean;
}

export const useBiometric = () => {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    isEnrolled: false,
    hasHardware: false,
    supportedTypes: [],
    isLoading: true,
  });

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const settings = await BiometricService.checkBiometricSettings();
      
      setState({
        isAvailable: settings.hasHardware && settings.isEnrolled,
        isEnrolled: settings.isEnrolled,
        hasHardware: settings.hasHardware,
        supportedTypes: settings.supportedTypes,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to check biometric availability:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const authenticate = async (options?: {
    promptMessage?: string;
    cancelLabel?: string;
    fallbackLabel?: string;
  }): Promise<BiometricResult> => {
    return await BiometricService.authenticate(options);
  };

  const getBiometricTypeName = (): string => {
    const { supportedTypes } = state;
    
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID';
    }

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris Recognition';
    }
    
    return 'Biometric Authentication';
  };

  return {
    ...state,
    authenticate,
    getBiometricTypeName,
    refresh: checkBiometricAvailability,
  };
};