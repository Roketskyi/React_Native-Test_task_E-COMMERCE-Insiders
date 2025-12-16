import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Product } from '../types';

interface OfflineStore {
  isOnline: boolean;
  cachedProducts: Product[];
  lastSync: string | null;
  pendingActions: Array<{
    id: string;
    type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_QUANTITY';
    payload: any;
    timestamp: string;
  }>;
  
  setOnlineStatus: (isOnline: boolean) => void;
  cacheProducts: (products: Product[]) => void;
  getCachedProducts: () => Product[];
  addPendingAction: (action: any) => void;
  clearPendingActions: () => void;
  updateLastSync: () => void;
  
  initialize: () => Promise<void>;
}

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      isOnline: true,
      cachedProducts: [],
      lastSync: null,
      pendingActions: [],

      setOnlineStatus: (isOnline: boolean) => {
        set({ isOnline });
      },

      cacheProducts: (products: Product[]) => {
        set({ 
          cachedProducts: products,
          lastSync: new Date().toISOString()
        });
      },

      getCachedProducts: () => {
        return get().cachedProducts;
      },

      addPendingAction: (action: any) => {
        const newAction = {
          ...action,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };
        
        set(state => ({
          pendingActions: [...state.pendingActions, newAction]
        }));
      },

      clearPendingActions: () => {
        set({ pendingActions: [] });
      },

      updateLastSync: () => {
        set({ lastSync: new Date().toISOString() });
      },

      initialize: async () => {
        try {
          NetInfo.addEventListener(state => {
            get().setOnlineStatus(state.isConnected ?? false);
          });

          const netInfo = await NetInfo.fetch();
          get().setOnlineStatus(netInfo.isConnected ?? false);
        } catch (error) {
          console.error('Failed to initialize offline store:', error);
        }
      },
    }),
    {
      name: 'offline-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cachedProducts: state.cachedProducts,
        lastSync: state.lastSync,
        pendingActions: state.pendingActions,
      }),
    }
  )
);