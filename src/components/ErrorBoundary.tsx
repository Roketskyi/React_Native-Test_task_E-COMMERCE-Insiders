import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Button } from './ui';
import { COLORS, SPACING } from '../constants/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Typography variant="h1" style={styles.errorIcon}>
              💥
            </Typography>
            
            <Typography variant="h3" weight="bold" align="center" style={styles.errorTitle}>
              Something went wrong
            </Typography>
            
            <Typography variant="body2" color="secondary" align="center" style={styles.errorDescription}>
              The app encountered an unexpected error. Please try restarting the app.
            </Typography>
            
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Typography variant="caption" color="error" style={styles.errorMessage}>
                  {this.state.error.message}
                </Typography>
              </View>
            )}
            
            <Button
              title="Try Again"
              onPress={this.handleReset}
              variant="primary"
              size="lg"
              style={styles.retryButton}
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  
  errorTitle: {
    marginBottom: SPACING.md,
  },
  
  errorDescription: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
    maxWidth: 300,
  },
  
  errorDetails: {
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    marginBottom: SPACING.lg,
    maxWidth: '100%',
  },
  
  errorMessage: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  
  retryButton: {
    minWidth: 160,
  },
});