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
    showAlert({
      title,
      message,
      buttons,
      dismissOnBackdropPress: options?.dismissOnBackdropPress ?? true,
    });
  }, [showAlert]);

  return {
    alertState,
    showAlert,
    hideAlert,
    alert,
  };
};