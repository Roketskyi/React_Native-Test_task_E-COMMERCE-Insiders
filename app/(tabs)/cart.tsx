import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../src/store';
import { Button, Typography, EmptyState, Loading } from '../../src/components/ui';
import { CartItem } from '../../src/components';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { NAVIGATION_ROUTES, VALIDATION } from '../../src/constants/app';
import { CartItemType } from '../../src/types';
import { useTheme } from '../../src/contexts';

export default function CartScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    isLoading,
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCartStore();

  // Memoized calculations for performance
  const cartSummary = useMemo(() => ({
    subtotal: totalPrice,
    shipping: 0, // Free shipping
    tax: Math.round(totalPrice * VALIDATION.TAX_RATE * 100) / 100,
    total: Math.round((totalPrice + totalPrice * VALIDATION.TAX_RATE) * 100) / 100,
  }), [totalPrice]);

  const handleQuantityChange = useCallback((productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((productId: number) => {
    removeItem(productId);
  }, [removeItem]);

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: clearCart 
        },
      ]
    );
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    router.push(NAVIGATION_ROUTES.CHECKOUT);
  }, [router]);

  const renderCartItem = useCallback(({ item }: { item: CartItemType }) => (
    <CartItem
      item={item}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemoveItem}
      isLoading={isLoading}
    />
  ), [handleQuantityChange, handleRemoveItem, isLoading]);

  const renderEmptyCart = useCallback(() => (
    <EmptyState
      icon="🛒"
      title="Your cart is empty"
      description="Add some products to get started shopping"
      actionTitle="Start Shopping"
      onAction={() => {
        router.push('/(tabs)');
      }}
    />
  ), []);

  const renderCartSummary = useCallback(() => (
    <>
      <View style={styles.summaryContent}>
        <Typography variant="h4" weight="bold" style={styles.summaryTitle}>
          Order Summary
        </Typography>
        
        <View style={styles.summaryRow}>
          <Typography variant="body1" color="secondary">
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
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
        
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border.primary }]}>
          <Typography variant="h4" weight="bold">
            Total
          </Typography>
          <Typography variant="h4" weight="bold" color="primary">
            ${cartSummary.total.toFixed(2)}
          </Typography>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          style={styles.checkoutButton}
        />
        
        <Button
          title="Clear Cart"
          onPress={handleClearCart}
          variant="outline"
          size="md"
          fullWidth
          disabled={isLoading}
          style={styles.clearButton}
        />
      </View>
    </>
  ), [
    totalItems, 
    cartSummary, 
    handleCheckout, 
    handleClearCart, 
    isLoading
  ]);

  const keyExtractor = useCallback((item: CartItemType) => item.id.toString(), []);

  const getItemLayout = useCallback((_data: unknown, index: number) => ({
    length: 140, // Approximate item height
    offset: 140 * index,
    index,
  }), []);

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.primary,
        borderBottomColor: colors.border.primary
      }]}>
        <Typography variant="h3" weight="bold">
          Shopping Cart
        </Typography>
        <Typography variant="body2" color="secondary">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Typography>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              // In a real app, might sync with server
            }}
            tintColor={colors.primary[500]}
          />
        }
      />
      
      <View style={[styles.summaryContainer, { backgroundColor: colors.background.card }]}>
        {renderCartSummary()}
      </View>
      
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.background.overlay }]}>
          <Loading size="small" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  
  cartList: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  
  summaryContainer: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
  },
  
  summaryContent: {
    padding: SPACING.lg,
  },
  
  summaryTitle: {
    marginBottom: SPACING.md,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  totalRow: {
    borderTopWidth: 1,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: 0,
  },
  
  buttonContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
    gap: SPACING.sm,
  },
  
  checkoutButton: {
    marginBottom: SPACING.xs,
  },
  
  clearButton: {
    // Additional styles if needed
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});