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

class AlertService {
  private alertHandler: ((config: AlertConfig) => void) | null = null;

  setAlertHandler(handler: (config: AlertConfig) => void) {
    this.alertHandler = handler;
  }

  alert(
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { dismissOnBackdropPress?: boolean }
  ) {
    if (this.alertHandler) {
      this.alertHandler({
        title,
        message,
        buttons: buttons || [{ text: 'OK' }],
        dismissOnBackdropPress: options?.dismissOnBackdropPress ?? true,
      });
    } else {
      // Fallback to native Alert if service not initialized
      const { Alert } = require('react-native');
      Alert.alert(title, message, buttons);
    }
  }
}

export const alertService = new AlertService();