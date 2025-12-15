import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { Product } from '../types';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  },

  getProductById: async (id: number): Promise<Product> => {
    return apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category));
  },

  getCategories: async (): Promise<string[]> => {
    return apiClient.get<string[]>(API_ENDPOINTS.CATEGORIES);
  },

  getLimitedProducts: async (limit: number): Promise<Product[]> => {
    return apiClient.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}?limit=${limit}`);
  },

  getSortedProducts: async (sort: 'asc' | 'desc' = 'asc'): Promise<Product[]> => {
    return apiClient.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}?sort=${sort}`);
  },
};