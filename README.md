# React Native E-Commerce App

A modern e-commerce mobile application built with React Native and Expo, featuring product browsing, cart management, and user authentication. This project demonstrates production-ready architecture and best practices for mobile development.

## 🛠 Tech Stack

- **React Native** (0.81.5) with **Expo** (~54.0.29)
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Zustand** for state management with persistence
- **TanStack Query** for server state management
- **AsyncStorage** & **SecureStore** for data persistence
- **StyleSheet API** with custom theme system for styling
- **React Hook Form** for form handling
- **API**: [Fake Store API](https://fakestoreapi.com)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platforms
npx expo run:android
npx expo run:ios
npx expo start --web
```

**Requirements**: Node.js 18+, Expo CLI, iOS Simulator/Android Emulator or physical device with Expo Go app.

## 🏗 Architecture & Key Decisions

### Project Structure
```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── services/      # API layer and external services
├── store/         # Zustand stores (auth, cart)
├── types/         # TypeScript type definitions
├── constants/     # App constants and configuration
├── contexts/      # React contexts (theme, alerts)
└── utils/         # Utility functions
```

### State Management
- **Zustand** chosen for simplicity and TypeScript support
- **Cart Store**: Persistent shopping cart with quantity validation
- **Auth Store**: User authentication with secure token storage
- **TanStack Query**: Server state caching with optimistic updates

### API Layer
- Centralized API client with error handling and retry logic
- Type-safe service layer for products and authentication
- Automatic request/response transformation

### Persistence Strategy
- **Cart data**: AsyncStorage for cross-session persistence
- **Auth tokens**: SecureStore for enhanced security
- **Theme preferences**: Context with system theme detection

### Theme System
- Dynamic light/dark mode support
- System theme detection with manual override
- Consistent color palette across components

## ✨ Features Covered

- ✅ **Product Catalog** - Browse products with categories and search
- ✅ **Product Details** - Detailed product view with ratings
- ✅ **Shopping Cart** - Add/remove items with quantity management
- ✅ **Search & Filter** - Debounced search with category filtering
- ✅ **User Authentication** - Login with demo credentials
- ✅ **Dark Theme** - System-aware theme switching
- ✅ **Data Persistence** - Cart and auth state preservation
- ✅ **Error Handling** - Comprehensive error boundaries and user feedback
- ✅ **Loading States** - Loading indicators and activity spinners
- ✅ **Navigation** - Tab-based navigation with stack screens
- ✅ **Checkout Flow** - Complete order placement with form validation

## 🔑 Demo Credentials

```
Username: mor_2314
Password: 83r5^_
```

## 📱 Navigation Structure

- **Home Tab**: Product listing with search and category filters
- **Cart Tab**: Shopping cart management and checkout flow
- **Profile Tab**: User profile and authentication
- **Product Details**: Stack-style product information screen
- **Auth Screen**: Login interface with demo credentials

## 🎯 Production-Ready Features

- TypeScript strict mode with comprehensive type coverage
- Error boundaries for graceful error handling
- Optimized FlatList rendering with proper key extraction
- Image loading states and error fallbacks
- Form validation with user feedback
- Accessibility considerations
- Performance optimizations (memo, callback optimization)
- Proper loading and error states throughout the app

---

*This project showcases modern React Native development practices suitable for production applications.*