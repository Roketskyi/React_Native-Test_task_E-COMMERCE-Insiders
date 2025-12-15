import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { COLORS, SPACING } from '../../constants/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  text,
  color = COLORS.primary[600],
  fullScreen = false,
}) => {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      
      {text && (
        <Typography
          variant="body2"
          color="secondary"
          align="center"
          style={styles.text}
        >
          {text}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  
  text: {
    marginTop: SPACING.md,
  },
});