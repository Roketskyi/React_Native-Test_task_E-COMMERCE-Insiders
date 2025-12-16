import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { Button, Typography } from './ui';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CollapsibleOrderSummaryProps {
  totalItems: number;
  cartSummary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  onCheckout: () => void;
  onClearCart: () => void;
  isLoading?: boolean;
}

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 410;

export const CollapsibleOrderSummary: React.FC<CollapsibleOrderSummaryProps> = ({
  totalItems,
  cartSummary,
  onCheckout,
  onClearCart,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const panelHeight = useRef(new Animated.Value(MAX_HEIGHT)).current;
  const lastHeight = useRef(MAX_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
      },
      
      onPanResponderGrant: () => {
        // Don't use setOffset, work with direct values
      },
      
      onPanResponderMove: (_, gestureState) => {
        const newHeight = lastHeight.current - gestureState.dy;
        const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
        
        panelHeight.setValue(clampedHeight);
      },
      
      onPanResponderRelease: (_, gestureState) => {
        const finalHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, lastHeight.current - gestureState.dy));
        lastHeight.current = finalHeight;
        
        Animated.spring(panelHeight, {
          toValue: finalHeight,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.card,
          height: panelHeight,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.dragHandle}>
        <View style={[styles.dragBar, { backgroundColor: colors.border.primary }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Typography variant="h4" weight="bold">
              Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </Typography>

            <Typography variant="h4" weight="bold" color="primary">
              ${cartSummary.total.toFixed(2)}
            </Typography>
          </View>
          
          <Button
            title="Proceed to Checkout"
            onPress={onCheckout}
            variant="success"
            size="lg"
            fullWidth
            disabled={isLoading}
            icon="💳"
            style={styles.checkoutButton}
          />
        </View>

        <View 
          style={styles.expandableContent}
        >
          <Typography variant="h4" weight="bold" style={styles.summaryTitle}>
            Order Summary
          </Typography>
          
          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="secondary">
                Subtotal
              </Typography>

              <Typography variant="body1" weight="medium">
                ${cartSummary.subtotal.toFixed(2)}
              </Typography>
            </View>
            
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="secondary">
                Shipping
              </Typography>

              <Typography variant="body1" weight="medium" color="success">
                Free
              </Typography>
            </View>
            
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="secondary">
                Tax
              </Typography>

              <Typography variant="body1" weight="medium">
                ${cartSummary.tax.toFixed(2)}
              </Typography>
            </View>
          </View>
          
          <Button
            title="Clear Cart"
            onPress={onClearCart}
            variant="danger"
            size="md"
            fullWidth
            disabled={isLoading}
            icon="🗑️"
            style={styles.clearButton}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
    overflow: 'hidden',
  },

  dragHandle: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },

  dragBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },

  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg + 65,
    overflow: 'hidden',
  },

  totalSection: {
    marginBottom: SPACING.md,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  checkoutButton: {
    marginBottom: SPACING.sm,
  },

  expandableContent: {
    // Remove flex: 1 to prevent stretching
  },

  summaryTitle: {
    marginBottom: SPACING.md,
  },

  summaryDetails: {
    marginBottom: SPACING.lg,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  clearButton: {
    marginTop: SPACING.md,
  },
});