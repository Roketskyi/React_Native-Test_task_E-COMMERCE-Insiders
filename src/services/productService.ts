import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { Product } from '../types';

export interface ProductFilters {
  category?: string;
  limit?: number;
  sort?: 'asc' | 'desc';
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
}

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    let endpoint = API_ENDPOINTS.PRODUCTS;
    const params = new URLSearchParams();

    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    if (filters?.sort) {
      params.append('sort', filters.sort);
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const products = await apiClient.get<Product[]>(endpoint);
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      return products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    return products;
  }

  async getProductById(id: number): Promise<Product> {
    if (!id || id <= 0) {
      throw new Error('Invalid product ID');
    }
    return apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!category || category.trim() === '') {
      throw new Error('Category is required');
    }
    return apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category));
  }

  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>(API_ENDPOINTS.CATEGORIES);
  }

  async getLimitedProducts(limit: number): Promise<Product[]> {
    if (limit <= 0) {
      throw new Error('Limit must be greater than 0');
    }
    return apiClient.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}?limit=${limit}`);
  }

  async getSortedProducts(sort: 'asc' | 'desc' = 'asc'): Promise<Product[]> {
    return apiClient.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}?sort=${sort}`);
  }

  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>): Promise<Product[]> {
    const products = await this.getProducts({ ...filters, search: query });
    return products;
  }
}

export const productService = new ProductService();