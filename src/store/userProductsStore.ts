import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProduct, CreateProductData } from '../types';

interface UserProductsStore {
  products: UserProduct[];
  isLoading: boolean;
  error: string | null;
  
  addProduct: (productData: CreateProductData) => Promise<void>;
  updateProduct: (id: string, productData: Partial<CreateProductData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => UserProduct | undefined;
  getUserProducts: (userId: number) => UserProduct[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserProductsStore = create<UserProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,

      addProduct: async (productData: CreateProductData) => {
        set({ isLoading: true, error: null });
        
        try {
          const newProduct: UserProduct = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...productData,
            createdAt: new Date().toISOString(),
            userId: 1,
          };

          set(state => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to add product:', error);
          set({
            error: 'Failed to add product',
            isLoading: false,
          });
          throw error;
        }
      },

      updateProduct: async (id: string, productData: Partial<CreateProductData>) => {
        set({ isLoading: true, error: null });
        
        try {
          set(state => ({
            products: state.products.map(product =>
              product.id === id
                ? { ...product, ...productData }
                : product
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to update product:', error);
          set({
            error: 'Failed to update product',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          set(state => ({
            products: state.products.filter(product => product.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to delete product:', error);
          set({
            error: 'Failed to delete product',
            isLoading: false,
          });
          throw error;
        }
      },

      getProduct: (id: string) => {
        return get().products.find(product => product.id === id);
      },

      getUserProducts: (userId: number) => {
        return get().products.filter(product => product.userId === userId);
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: 'user-products-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);