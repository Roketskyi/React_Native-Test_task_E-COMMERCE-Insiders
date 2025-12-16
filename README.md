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
- **Expo Local Authentication** for biometric authentication
- **Expo Image Picker** & **Camera** for media handling
- **Expo Location** for geolocation services
- **React Native Gesture Handler** for swipe gestures
- **Shopify FlashList** for optimized list performance
- **React Native NetInfo** for offline detection
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

### 📱 Device Permissions Required
- **Camera**: For taking product photos
- **Media Library**: For selecting photos from gallery
- **Location**: For automatic address detection in checkout
- **Biometric**: For Face ID/Touch ID authentication (optional)

### ⚙️ Configuration Notes
- Deep linking scheme: `rntestproject://` (configured in app.json)
- Biometric authentication requires physical device (not available in simulators)
- Location services work in simulators with mock locations
- Camera functionality requires physical device

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

### Core Features
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

### Advanced Features (Day 8)
- ✅ **Biometric Authentication** - Face ID/Touch ID login with fallback
- ✅ **Create Products** - User-generated products with image picker
- ✅ **My Products** - Personal product management in profile
- ✅ **Swipe-to-Delete** - Gesture-based cart item removal
- ✅ **Geolocation** - Location-based checkout with address detection
- ✅ **Deep Linking** - Product sharing with app deep links
- ✅ **Offline Mode** - Basic offline support with cached data
- ✅ **Performance** - FlashList implementation for better scrolling

## 🔑 Demo Credentials

```
Username: mor_2314
Password: 83r5^_
```

## 📋 How to Use Advanced Features

### 🔐 Biometric Authentication
- Available on the login screen below the regular login form
- Supports Face ID (iOS), Touch ID (iOS), and Fingerprint (Android)
- Falls back to demo credentials automatically for testing
- Requires device with biometric hardware and enrolled biometrics

### 📸 Create Products
- Access via "Add Product" button in Profile → My Products section
- Take photos with camera or select from gallery
- Automatic permission handling for camera and media library
- Form validation with real-time error feedback
- Products are stored locally and linked to user account

### 🗂 My Products Management
- View your created products in the Profile tab
- Grid layout with product images and details
- Delete products with confirmation dialog
- Navigate to product details by tapping items

### 👆 Swipe-to-Delete in Cart
- Swipe left on any cart item to reveal delete action
- Smooth animations with visual feedback
- Confirmation dialog before removal
- Hint displayed at top of cart screen

### 📍 Location Services in Checkout
- "Use Current Location" button in delivery address field
- Automatic address lookup from GPS coordinates
- Falls back to coordinates if address lookup fails
- Handles permission requests gracefully

### 🔗 Product Sharing (Deep Links)
- Share products via native share sheet
- Deep links format: `rntestproject://product-details?id=123`
- Works with both API products and user-created products
- Automatic app opening when links are tapped

### 📡 Offline Mode
- Automatic network status detection
- Products cached for offline browsing
- Offline indicator appears when disconnected
- Pending actions queued for when connection returns

## 📱 Navigation Structure

- **Home Tab**: Product listing with search and category filters
- **Cart Tab**: Shopping cart management and checkout flow
- **Profile Tab**: User profile and authentication
- **Product Details**: Stack-style product information screen
- **Auth Screen**: Login interface with demo credentials

## 🎯 Production-Ready Features

### Core Architecture
- TypeScript strict mode with comprehensive type coverage
- Error boundaries for graceful error handling
- Optimized FlashList rendering with proper key extraction
- Image loading states and error fallbacks
- Form validation with user feedback
- Accessibility considerations
- Performance optimizations (memo, callback optimization)
- Proper loading and error states throughout the app

### Advanced Capabilities
- Biometric authentication with proper fallbacks
- Native device capabilities (camera, location, gestures)
- Offline-first architecture with data synchronization
- Deep linking for content sharing
- Gesture-based interactions for better UX
- Real-time network status monitoring
- Secure local data storage and user-generated content

## 🔧 Technical Implementation Details

### Biometric Authentication
- **Service**: `src/services/biometricService.ts`
- **Component**: `src/components/BiometricLogin.tsx`
- **Hook**: `src/hooks/useBiometric.ts`
- Uses Expo Local Authentication with hardware detection
- Graceful fallback for devices without biometric support

### Image Handling
- **Service**: `src/services/imagePickerService.ts`
- Supports both camera capture and gallery selection
- Automatic permission handling with user-friendly error messages
- Image optimization (aspect ratio 1:1, quality 0.8)

### Geolocation
- **Service**: `src/services/locationService.ts`
- GPS coordinates with reverse geocoding to addresses
- Permission handling with informative error messages
- Fallback to coordinates when address lookup fails

### Gesture Handling
- **Component**: `src/components/SwipeableCartItem.tsx`
- Custom PanResponder implementation for swipe-to-delete
- Smooth animations with spring physics
- Threshold-based gesture recognition

### Offline Support
- **Store**: `src/store/offlineStore.ts`
- **Component**: `src/components/OfflineIndicator.tsx`
- Network status monitoring with React Native NetInfo
- Product caching with AsyncStorage persistence
- Pending action queue for offline operations

### Deep Linking
- **Service**: `src/services/sharingService.ts`
- Custom URL scheme: `rntestproject://`
- Product sharing with native Share API
- Link parsing and navigation handling

### Performance Optimizations
- **FlashList**: Used in `src/components/ProductGrid.tsx`
- Optimized rendering for large product lists
- Proper key extraction and item layout calculation
- Memory-efficient scrolling with view recycling

### Known Limitations
- User products are stored locally only (no backend sync)
- Deep links require manual navigation implementation
- Offline mode is basic (no complex sync logic)
- No real payment processing (demo only)

----

*This project showcases modern React Native development practices suitable for production applications.*