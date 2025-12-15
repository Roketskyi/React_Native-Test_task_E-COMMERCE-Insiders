export const APP_CONFIG = {
  NAME: 'RN E-commerce',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional React Native E-commerce Demo',
  AUTHOR: 'Senior React Native Developer',
} as const;

export const DEMO_CREDENTIALS = {
  USERNAME: 'mor_2314',
  PASSWORD: '83r5^_',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CART_DATA: 'cart_data',
  THEME_MODE: 'theme_mode',
} as const;

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER: 'user',
  CART: 'cart',
} as const;

export const NAVIGATION_ROUTES = {
  TABS: '/(tabs)',
  HOME: '/(tabs)/',
  CART: '/(tabs)/cart',
  PROFILE: '/(tabs)/profile',
  AUTH: '/auth',
  CHECKOUT: '/checkout',
  PRODUCT_DETAILS: '/product-details',
} as const;

export const LIMITS = {
  SEARCH_DEBOUNCE: 300,
  MAX_CART_QUANTITY: 99,
  MAX_TITLE_LENGTH: 40,
  PRODUCTS_PER_PAGE: 20,
} as const;

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_ADDRESS_LENGTH: 10,
  MAX_ADDRESS_LENGTH: 200,
  TAX_RATE: 0.08,
} as const;

export const MESSAGES = {
  ORDER_SUCCESS: 'Order Successful! 🎉',
  ORDER_ERROR: 'Something went wrong. Please try again.',
  EMPTY_CART: 'Cart is Empty',
  PROCESSING_ORDER: 'Processing your order...',
} as const;