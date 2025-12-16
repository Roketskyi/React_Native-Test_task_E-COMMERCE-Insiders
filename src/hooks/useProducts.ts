import { useQuery, useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query';
import { productService, ProductFilters } from '../services/productService';
import { Product } from '../types';
import { ApiError } from '../services/api';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters = {}) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  search: (query: string, filters?: ProductFilters) => [...productKeys.all, 'search', { query, filters }] as const,
};

const DEFAULT_STALE_TIME = 5 * 60 * 1000;
const DEFAULT_GC_TIME = 10 * 60 * 1000;

export const useProducts = (
  filters?: ProductFilters,
  options?: Omit<UseQueryOptions<Product[], ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: (failureCount, error) => {
      if (error?.code === 'NETWORK_ERROR') return failureCount < 3;
      if (error?.status === 404) return false;
      return failureCount < 2;
    },

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProductsByCategory = (
  category: string,
  options?: Omit<UseQueryOptions<Product[], ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: productKeys.list({ category }),
    queryFn: () => productService.getProductsByCategory(category),
    enabled: !!category && category !== 'all',
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: (failureCount, error) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },

    ...options,
  });
};

export const useCategories = (
  options?: Omit<UseQueryOptions<string[], ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productService.getCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,

    ...options,
  });
};

export const useSearchProducts = (
  query: string,
  filters?: Omit<ProductFilters, 'search'>,
  options?: Omit<UseQueryOptions<Product[], ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: productKeys.search(query, filters),
    queryFn: () => productService.searchProducts(query, filters),
    enabled: !!query && query.trim().length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,

    ...options,
  });
};

export const useLimitedProducts = (limit: number) => {
  return useQuery({
    queryKey: productKeys.list({ limit }),
    queryFn: () => productService.getLimitedProducts(limit),
    enabled: limit > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSortedProducts = (sort: 'asc' | 'desc' = 'asc') => {
  return useQuery({
    queryKey: productKeys.list({ sort }),
    queryFn: () => productService.getSortedProducts(sort),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useInfiniteProducts = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), 'infinite', { limit }],
    queryFn: () => productService.getLimitedProducts(limit),
    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length : undefined;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};