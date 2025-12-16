import { useState, useCallback } from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  dismissOnBackdropPress?: boolean;
}

interface AlertState extends AlertConfig {
  visible: boolean;
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    dismissOnBackdropPress: true,
  });

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertState({
      ...config,
      visible: true,
      buttons: config.buttons || [{ text: 'OK' }],
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const alert = useCallback((
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { dismissOnBackdropPress?: boolean }
  ) => {
    const config: AlertConfig = {
      title,
      dismissOnBackdropPress: options?.dismissOnBackdropPress ?? true,
    };
    
    if (message !== undefined) {
      config.message = message;
    }
    
    if (buttons !== undefined) {
      config.buttons = buttons;
    }
    
    showAlert(config);
  }, [showAlert]);

  return {
    alertState,
    showAlert,
    hideAlert,
    alert,
  };
};