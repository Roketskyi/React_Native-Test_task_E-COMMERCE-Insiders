import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../src/hooks';
import { Button, Typography, Input } from '../src/components/ui';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { useTheme } from '../src/contexts';
import { useAlertContext } from '../src/contexts/AlertContext';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { alert } = useAlertContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { login, isLoading, loginError } = useAuth();

  React.useEffect(() => {
    setIsFormValid(username.trim().length > 0 && password.trim().length > 0);
  }, [username, password]);

  const handleLogin = () => {
    if (!isFormValid) return;

    login(
      { username: username.trim(), password: password.trim() },
      {
        onSuccess: () => {
          alert('Success', 'Login successful!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') }
          ]);
        },

        onError: (error: Error) => {
          alert(
            'Login Failed',
            error?.message || 'Invalid credentials. Please try again.',
            [{ text: 'OK' }]
          );
        },
      }
    );
  };

  const handleBack = () => {
    router.back();
  };

  const fillDemoCredentials = () => {
    setUsername('mor_2314');
    setPassword('83r5^_');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Typography variant="h2" weight="bold" align="center">
              Welcome Back
            </Typography>

            <Typography variant="body2" color="secondary" align="center" style={styles.subtitle}>
              Sign in to your account to continue
            </Typography>
          </View>

          <View style={[styles.formContainer, { backgroundColor: colors.background.card }]}>
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
              required
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              required
            />

            {loginError && (
              <View style={[styles.errorContainer, { 
                backgroundColor: colors.error + '10',
                borderColor: colors.error + '30'
              }]}>
                <Typography variant="caption" color="error" align="center">
                  {loginError.message || 'Login failed. Please try again.'}
                </Typography>
              </View>
            )}

            <Button
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!isFormValid}
              loading={isLoading}
              style={styles.loginButton}
            />

            <View style={[styles.demoContainer, { backgroundColor: colors.background.tertiary }]}>
              <Typography variant="caption" color="tertiary" align="center" style={styles.demoText}>
                Demo Account Available
              </Typography>
              
              <Button
                title="Use Demo Credentials"
                onPress={fillDemoCredentials}
                variant="info"
                size="sm"
                icon="🔑"
                style={styles.demoButton}
              />
            </View>

            <View style={styles.optionsContainer}>
              <Typography variant="caption" color="secondary" align="center">
                Don't have an account?{' '}
                <Typography variant="caption" color="primary" weight="medium">
                  Sign Up
                </Typography>
              </Typography>
              
              <Typography variant="caption" color="primary" align="center" style={styles.forgotPassword}>
                Forgot Password?
              </Typography>
            </View>
          </View>

          <Button
            title="Back to Store"
            onPress={handleBack}
            variant="subtle"
            size="lg"
            fullWidth
            icon="🏪"
            style={styles.backButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  keyboardAvoid: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  
  header: {
    marginBottom: SPACING['2xl'],
    alignItems: 'center',
  },
  
  subtitle: {
    marginTop: SPACING.sm,
  },
  
  formContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  
  errorContainer: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  
  loginButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  
  demoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  
  demoText: {
    marginBottom: SPACING.xs,
  },
  
  demoButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  
  optionsContainer: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  
  forgotPassword: {
    marginTop: SPACING.sm,
  },
  
  backButton: {
    marginTop: SPACING.md,
  },
});