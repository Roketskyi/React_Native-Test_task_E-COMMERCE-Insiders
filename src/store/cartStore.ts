import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  getItemQuantity: (productId: number) => number;
  isItemInCart: (productId: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);

        let newItems: CartItem[];
        
        if (existingItem) {
          newItems = items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...items, { ...product, quantity }];
        }

        const { totalItems, totalPrice } = newItems.reduce(
          (acc, item) => ({
            totalItems: acc.totalItems + item.quantity,
            totalPrice: acc.totalPrice + (item.price * item.quantity),
          }),
          { totalItems: 0, totalPrice: 0 }
        );

        set({
          items: newItems,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100,
        });
      },

      removeItem: (productId: number) => {
        const { items } = get();
        const newItems = items.filter(item => item.id !== productId);
        
        const { totalItems, totalPrice } = newItems.reduce(
          (acc, item) => ({
            totalItems: acc.totalItems + item.quantity,
            totalPrice: acc.totalPrice + (item.price * item.quantity),
          }),
          
          { totalItems: 0, totalPrice: 0 }
        );

        set({
          items: newItems,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100,
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const newItems = items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        );

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        set({
          items: newItems,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100,
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItemQuantity: (productId: number) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        return item?.quantity || 0;
      },

      isItemInCart: (productId: number) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);