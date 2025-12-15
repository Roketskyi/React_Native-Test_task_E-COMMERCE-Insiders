export const API_CONFIG = {
  BASE_URL: 'https://fakestoreapi.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
  CATEGORIES: '/products/categories',

  LOGIN: '/auth/login',
  
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  
  CARTS: '/carts',
  CART_BY_ID: (id: number) => `/carts/${id}`,
  USER_CARTS: (userId: number) => `/carts/user/${userId}`,
} as const;