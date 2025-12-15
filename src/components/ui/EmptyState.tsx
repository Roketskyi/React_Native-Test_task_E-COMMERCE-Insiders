import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { SPACING } from '../../constants/theme';
import { createShadow } from '../../utils/platform';
import { useTheme } from '../../contexts';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.background.card }]}>
        <Typography variant="h1" style={styles.icon}>
          {icon}
        </Typography>
      </View>
      
      <Typography variant="h3" weight="bold" align="center" style={styles.title}>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body2" color="secondary" align="center" style={styles.description}>
          {description}
        </Typography>
      )}
      
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING['2xl'],
  },
  
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...createShadow(2, '#000', 0.08),
  },
  
  icon: {
    fontSize: 40,
    opacity: 0.7,
  },
  
  title: {
    marginBottom: SPACING.sm,
  },
  
  description: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
    maxWidth: 280,
  },
  
  actionButton: {
    minWidth: 160,
  },
});