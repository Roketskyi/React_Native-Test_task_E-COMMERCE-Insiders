import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Alert as RNAlert } from 'react-native';
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
    buttons?: AlertButton[]
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
  const alert = (
    title: string,
    message?: string,
    buttons?: AlertButton[]
  ) => {
    RNAlert.alert(title, message, buttons);
  };

  const showAlert = (config: {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    dismissOnBackdropPress?: boolean;
  }) => {
    RNAlert.alert(config.title, config.message, config.buttons);
  };

  const hideAlert = () => {
    // React Native Alert doesn't need manual hiding
  };

  useEffect(() => {
    alertService.setAlertHandler(showAlert);
  }, []);

  const contextValue: AlertContextType = {
    alert,
    showAlert,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
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