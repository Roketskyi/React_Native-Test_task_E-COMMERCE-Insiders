import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks';
import { Button, Typography } from '../../src/components/ui';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { useTheme } from '../../src/contexts';

interface ProfileOptionProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: string;
  showArrow?: boolean;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({
  title,
  subtitle,
  onPress,
  icon = '⚙️',
  showArrow = true,
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.optionContainer, { borderBottomColor: colors.border.primary }]} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background.tertiary }]}>
          <Typography variant="body1">{icon}</Typography>
        </View>

        <View style={styles.optionText}>
          <Typography variant="body1" weight="medium">
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="caption" color="secondary">
              {subtitle}
            </Typography>
          )}
        </View>
      </View>
      
      {showArrow && (
        <Typography variant="body1" color="tertiary">
          →
        </Typography>
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const { colors, mode, setThemeMode } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This feature would navigate to edit profile screen');
  };

  const handleOrderHistory = () => {
    Alert.alert('Order History', 'This feature would show order history');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'This feature would navigate to settings screen');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'This feature would navigate to support/help screen');
  };

  const handleThemeChange = () => {
    const options: { text: string; onPress: () => void }[] = [
      { text: 'Light', onPress: () => setThemeMode('light') },
      { text: 'Dark', onPress: () => setThemeMode('dark') },
      { text: 'System', onPress: () => setThemeMode('system') },
      { text: 'Cancel', onPress: () => {} },
    ];

    Alert.alert(
      'Choose Theme',
      `Current: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
      options
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About',
      'React Native E-commerce Demo App\n\nBuilt with:\n• React Native + Expo\n• TypeScript\n• Zustand\n• TanStack Query\n• Professional Architecture\n• Dark/Light Theme Support'
    );
  };

  const renderUserInfo = () => {
    if (!isAuthenticated || !user) return null;

    return (
      <View style={[styles.userInfoContainer, { backgroundColor: colors.background.card }]}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary[600] }]}>
          <Typography variant="h2" color="inverse">
            {user.name.firstname.charAt(0).toUpperCase()}
            {user.name.lastname.charAt(0).toUpperCase()}
          </Typography>
        </View>
        
        <View style={styles.userDetails}>
          <Typography variant="h3" weight="bold" align="center">
            {user.name.firstname} {user.name.lastname}
          </Typography>

          <Typography variant="body2" color="secondary" align="center" style={styles.userEmail}>
            {user.email}
          </Typography>

          <Typography variant="caption" color="tertiary" align="center">
            @{user.username}
          </Typography>
        </View>
      </View>
    );
  };

  const renderGuestState = () => (
    <View style={[styles.guestContainer, { backgroundColor: colors.background.card }]}>
      <Typography variant="h3" weight="bold" align="center">
        Welcome to Our Store
      </Typography>

      <Typography variant="body2" color="secondary" align="center" style={styles.guestText}>
        Sign in to access your profile, order history, and personalized recommendations
      </Typography>
      
      <Button
        title="Sign In"
        onPress={handleLogin}
        variant="primary"
        size="lg"
        fullWidth
        style={styles.signInButton}
      />
      
      <Typography variant="caption" color="tertiary" align="center" style={styles.demoNote}>
        Demo credentials: mor_2314 / 83r5^_
      </Typography>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isAuthenticated ? renderUserInfo() : renderGuestState()}
        
        <View style={[styles.optionsContainer, { backgroundColor: colors.background.card }]}>
          {isAuthenticated && (
            <>
              <ProfileOption
                title="Edit Profile"
                subtitle="Update your personal information"
                icon="👤"
                onPress={handleEditProfile}
              />
              
              <ProfileOption
                title="Order History"
                subtitle="View your past orders"
                icon="📦"
                onPress={handleOrderHistory}
              />
            </>
          )}
          
          <ProfileOption
            title="Theme"
            subtitle={`Current: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
            icon="🎨"
            onPress={handleThemeChange}
          />
          
          <ProfileOption
            title="Settings"
            subtitle="App preferences and notifications"
            icon="⚙️"
            onPress={handleSettings}
          />
          
          <ProfileOption
            title="Help & Support"
            subtitle="Get help or contact us"
            icon="❓"
            onPress={handleSupport}
          />
          
          <ProfileOption
            title="About"
            subtitle="App version and information"
            icon="ℹ️"
            onPress={handleAbout}
          />
          
          <ProfileOption
            title="Demo Modal"
            subtitle="Example modal screen"
            icon="📱"
            onPress={() => router.push('/modal')}
          />
        </View>
        
        {isAuthenticated && (
          <View style={styles.logoutContainer}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              size="lg"
              fullWidth
              loading={isLoading}
              style={{ ...styles.logoutButton, borderColor: colors.error }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  scrollContent: {
    padding: SPACING.lg,
  },
  
  userInfoContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  userDetails: {
    alignItems: 'center',
  },
  
  userEmail: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  
  guestContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  
  guestText: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  
  signInButton: {
    marginBottom: SPACING.md,
  },
  
  demoNote: {
    fontStyle: 'italic',
  },
  
  optionsContainer: {
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  
  optionText: {
    flex: 1,
  },
  
  logoutContainer: {
    marginTop: SPACING.md,
  },
  
  logoutButton: {
    // Border color will be set dynamically
  },
});