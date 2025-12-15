import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '../services';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: productService.getProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: productKeys.list({ category }),
    queryFn: () => productService.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productService.getCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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