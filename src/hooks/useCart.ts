import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useCartStore } from '../store';
import { Product } from '../types';

export const useCart = () => {
  const store = useCartStore();

  // Enhanced add to cart with user feedback
  const addToCart = useCallback((product: Product, quantity = 1) => {
    const currentQuantity = store.getItemQuantity(product.id);
    const isNewItem = currentQuantity === 0;
    
    store.addItem(product, quantity);
    
    // Optional: Show success feedback
    if (isNewItem) {
      // Could show toast: "Added to cart"
    } else {
      // Could show toast: "Updated quantity"
    }
  }, [store]);

  // Enhanced remove with confirmation
  const removeFromCart = useCallback((productId: number, showConfirmation = true) => {
    if (showConfirmation) {
      const item = store.items.find(item => item.id === productId);
      if (item) {
        Alert.alert(
          'Remove Item',
          `Remove "${item.title}" from your cart?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Remove', 
              style: 'destructive', 
              onPress: () => store.removeItem(productId) 
            },
          ]
        );
        return;
      }
    }
    store.removeItem(productId);
  }, [store]);

  // Bulk operations
  const clearCart = useCallback((showConfirmation = true) => {
    if (showConfirmation && store.items.length > 0) {
      Alert.alert(
        'Clear Cart',
        'Are you sure you want to remove all items from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear All', 
            style: 'destructive', 
            onPress: () => store.clearCart() 
          },
        ]
      );
      return;
    }
    store.clearCart();
  }, [store]);

  // Cart summary calculations
  const cartSummary = useMemo(() => {
    const subtotal = store.totalPrice;
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: store.totalItems,
      isEmpty: store.items.length === 0,
      hasItems: store.items.length > 0,
    };
  }, [store.totalPrice, store.totalItems, store.items.length]);

  // Cart validation
  const canCheckout = useMemo(() => {
    return store.items.length > 0 && !store.isLoading;
  }, [store.items.length, store.isLoading]);

  // Item utilities
  const getItemInfo = useCallback((productId: number) => {
    const quantity = store.getItemQuantity(productId);
    const isInCart = store.isItemInCart(productId);
    const subtotal = store.getItemSubtotal(productId);

    return {
      quantity,
      isInCart,
      subtotal,
    };
  }, [store]);

  return {
    // State
    items: store.items,
    isLoading: store.isLoading,
    lastUpdated: store.lastUpdated,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart,
    
    // Bulk operations
    removeMultipleItems: store.removeMultipleItems,
    
    // Utilities
    getItemInfo,
    cartSummary,
    canCheckout,
    
    // Raw store access for advanced use cases
    store,
  };
};

export default useCart;