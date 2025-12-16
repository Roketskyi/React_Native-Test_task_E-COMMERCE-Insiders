import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useOfflineStore } from '../store/offlineStore';
import { Typography } from './ui';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, BORDER_RADIUS } from '../constants/theme';

export const OfflineIndicator: React.FC = () => {
  const { colors } = useTheme();
  const { isOnline, lastSync, cachedProducts } = useOfflineStore();
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (!isOnline) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline, fadeAnim]);

  if (isOnline) {
    return null;
  }

  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    
    const syncDate = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - syncDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.warning + '20',
          borderColor: colors.warning,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Typography variant="caption" color="warning" weight="medium">
          📡 Offline Mode
        </Typography>
        
        <Typography variant="caption" color="secondary" style={styles.details}>
          {cachedProducts.length} products cached • Last sync: {formatLastSync()}
        </Typography>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  
  content: {
    padding: SPACING.sm,
    alignItems: 'center',
  },
  
  details: {
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});