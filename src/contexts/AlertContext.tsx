import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../components/ui/Alert';
import { alertService } from '../services/alertService';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertContextType {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { dismissOnBackdropPress?: boolean }
  ) => void;
  showAlert: (config: {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    dismissOnBackdropPress?: boolean;
  }) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const { alertState, showAlert, hideAlert, alert } = useAlert();

  // Register alert handler with service
  useEffect(() => {
    alertService.setAlertHandler(showAlert);
  }, [showAlert]);

  const contextValue: AlertContextType = {
    alert,
    showAlert,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <Alert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onDismiss={hideAlert}
        dismissOnBackdropPress={alertState.dismissOnBackdropPress}
      />
    </AlertContext.Provider>
  );
}

export function useAlertContext(): AlertContextType {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
}