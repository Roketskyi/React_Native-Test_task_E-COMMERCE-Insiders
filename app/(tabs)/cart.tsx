import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useCartStore } from '../../src/store';
import { Typography, EmptyState, Loading } from '../../src/components/ui';
import { SwipeableCartItem } from '../../src/components/SwipeableCartItem';
import { CollapsibleOrderSummary } from '../../src/components/CollapsibleOrderSummary';
import { SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { NAVIGATION_ROUTES, VALIDATION } from '../../src/constants/app';
import { CartItemType } from '../../src/types';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAlertContext } from '../../src/contexts/AlertContext';

export default function CartScreen() {
  const { colors } = useTheme();
  const { alert } = useAlertContext();
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

  const cartSummary = useMemo(() => ({
    subtotal: totalPrice,
    shipping: 0,
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
    alert(
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
  }, [clearCart, alert]);

  const handleCheckout = useCallback(() => {
    router.push(NAVIGATION_ROUTES.CHECKOUT);
  }, [router]);

  const renderCartItem = useCallback(({ item }: { item: CartItemType }) => (
    <SwipeableCartItem
      item={item}
      onQuantityChange={handleQuantityChange}
      onDelete={handleRemoveItem}
    />
  ), [handleQuantityChange, handleRemoveItem]);

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



  const keyExtractor = useCallback((item: CartItemType) => item.id.toString(), []);

  const getItemLayout = useCallback((_data: unknown, index: number) => ({
    length: 140,
    offset: 140 * index,
    index,
  }), []);

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        {renderEmptyCart()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={[styles.hintContainer, { backgroundColor: colors.background.tertiary }]}>
        <Typography variant="caption" color="tertiary" align="center" style={styles.hintText}>
          Swipe left to remove items
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
      
      <CollapsibleOrderSummary
        totalItems={totalItems}
        cartSummary={cartSummary}
        onCheckout={handleCheckout}
        onClearCart={handleClearCart}
        isLoading={isLoading}
      />
      
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.background.overlay }]}>
          <Loading size="small" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  hintContainer: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'center',
  },
  
  hintText: {
    fontSize: 11,
    opacity: 0.7,
  },
  
  cartList: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
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