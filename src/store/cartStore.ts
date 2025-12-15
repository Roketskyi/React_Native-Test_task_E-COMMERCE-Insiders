import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItemType } from '../types';

// Business logic constants
const MAX_QUANTITY_PER_ITEM = 99;
const MIN_QUANTITY = 1;

// Enhanced cart state interface
interface CartState {
  items: CartItemType[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  lastUpdated: number;
}

// Cart actions interface
interface CartActions {
  // Core cart operations
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Utility methods
  getItemQuantity: (productId: number) => number;
  isItemInCart: (productId: number) => boolean;
  getItemSubtotal: (productId: number) => number;
  
  // Bulk operations
  removeMultipleItems: (productIds: number[]) => void;
  
  // Future extensibility
  applyDiscount?: (discountCode: string) => void;
  calculateTax?: (taxRate: number) => number;
}

interface CartStore extends CartState, CartActions {}

// Business logic helpers
const calculateTotals = (items: CartItemType[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    totalItems,
    totalPrice: Math.round(totalPrice * 100) / 100, // Avoid floating point issues
  };
};

const validateQuantity = (quantity: number): number => {
  return Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY_PER_ITEM, quantity));
};

// Enhanced cart store with improved business logic
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      lastUpdated: Date.now(),

      // Core operations with business logic
      addItem: (product: Product, quantity = 1) => {
        set({ isLoading: true });
        
        try {
          const { items } = get();
          const existingItem = items.find(item => item.id === product.id);
          const validQuantity = validateQuantity(quantity);

          let newItems: CartItemType[];
          
          if (existingItem) {
            const newQuantity = validateQuantity(existingItem.quantity + validQuantity);
            newItems = items.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            );
          } else {
            newItems = [...items, { ...product, quantity: validQuantity }];
          }

          const { totalItems, totalPrice } = calculateTotals(newItems);

          set({
            items: newItems,
            totalItems,
            totalPrice,
            lastUpdated: Date.now(),
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      removeItem: (productId: number) => {
        set({ isLoading: true });
        
        try {
          const { items } = get();
          const newItems = items.filter(item => item.id !== productId);
          const { totalItems, totalPrice } = calculateTotals(newItems);

          set({
            items: newItems,
            totalItems,
            totalPrice,
            lastUpdated: Date.now(),
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({ isLoading: true });
        
        try {
          const { items } = get();
          const validQuantity = validateQuantity(quantity);
          
          const newItems = items.map(item =>
            item.id === productId
              ? { ...item, quantity: validQuantity }
              : item
          );

          const { totalItems, totalPrice } = calculateTotals(newItems);

          set({
            items: newItems,
            totalItems,
            totalPrice,
            lastUpdated: Date.now(),
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          lastUpdated: Date.now(),
          isLoading: false,
        });
      },

      // Utility methods
      getItemQuantity: (productId: number) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        return item?.quantity || 0;
      },

      isItemInCart: (productId: number) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      getItemSubtotal: (productId: number) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        if (!item) return 0;
        return Math.round(item.price * item.quantity * 100) / 100;
      },

      // Bulk operations
      removeMultipleItems: (productIds: number[]) => {
        set({ isLoading: true });
        
        try {
          const { items } = get();
          const newItems = items.filter(item => !productIds.includes(item.id));
          const { totalItems, totalPrice } = calculateTotals(newItems);

          set({
            items: newItems,
            totalItems,
            totalPrice,
            lastUpdated: Date.now(),
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Enhanced persistence options
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        lastUpdated: state.lastUpdated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate totals on rehydration to ensure consistency
          const { totalItems, totalPrice } = calculateTotals(state.items);
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
          state.isLoading = false;
        }
      },
    }
  )
);

// Export business logic constants for use in components
export { MAX_QUANTITY_PER_ITEM, MIN_QUANTITY };