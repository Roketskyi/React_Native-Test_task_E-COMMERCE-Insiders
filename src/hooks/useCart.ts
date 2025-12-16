import { useCallback, useMemo } from 'react';
import { useCartStore } from '../store';
import { Product } from '../types';
import { alertService } from '../services/alertService';

export const useCart = () => {
  const store = useCartStore();

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const currentQuantity = store.getItemQuantity(product.id);
    const isNewItem = currentQuantity === 0;
    
    store.addItem(product, quantity);
    
    if (isNewItem) {
      // Could show toast: "Added to cart"
    } else {
      // Could show toast: "Updated quantity"
    }
  }, [store]);

  const removeFromCart = useCallback((productId: number, showConfirmation = true) => {
    if (showConfirmation) {
      const item = store.items.find(item => item.id === productId);

      if (item) {
        alertService.alert(
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

  const clearCart = useCallback((showConfirmation = true) => {
    if (showConfirmation && store.items.length > 0) {
      alertService.alert(
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

  const cartSummary = useMemo(() => {
    const subtotal = store.totalPrice;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
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

  const canCheckout = useMemo(() => {
    return store.items.length > 0 && !store.isLoading;
  }, [store.items.length, store.isLoading]);

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
    items: store.items,
    isLoading: store.isLoading,
    lastUpdated: store.lastUpdated,
    
    addToCart,
    removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart,
    
    removeMultipleItems: store.removeMultipleItems,
    
    getItemInfo,
    cartSummary,
    canCheckout,
    
    store,
  };
};

export default useCart;