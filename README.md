# RN E-commerce Demo

Professional React Native E-commerce application demonstrating modern development practices and clean architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Important Note
⚠️ **Path Requirements**: Ensure the project is located in a path with only English characters. Gradle build may fail with Cyrillic or special characters in the path.

### Installation & Setup

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# If you encounter path-related issues, move the project to:
# C:\dev\RNTestProject or C:\Users\[username]\Desktop\RNTestProject
```

### Running the App
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator  
- Scan QR code with Expo Go app on your device

## 🛠 Technologies Used

### Core Framework
- **React Native** with Expo SDK
- **TypeScript** for type safety
- **Expo Router** for file-based navigation

### State Management
- **Zustand** - Lightweight state management
  - Chosen for its simplicity and excellent TypeScript support
  - Minimal boilerplate compared to Redux
  - Built-in persistence with AsyncStorage

### Data Fetching
- **TanStack Query (React Query)** - Server state management
  - Automatic caching and background updates
  - Optimistic updates and error handling
  - Better UX with loading states

### Form Handling
- **React Hook Form** with custom validation
  - Performant forms with minimal re-renders
  - Type-safe validation functions
  - Excellent developer experience

### UI & Styling
- **NativeWind** (Tailwind CSS for React Native)
- Custom design system with consistent theming
- Platform-specific optimizations

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── ...             # Feature-specific components
├── constants/          # App constants and configuration
│   ├── theme.ts        # Design system tokens
│   ├── api.ts          # API endpoints
│   └── app.ts          # App-wide constants
├── hooks/              # Custom React hooks
├── services/           # API services and external integrations
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

app/                    # Expo Router pages
├── (tabs)/            # Tab navigation screens
├── auth.tsx           # Authentication screen
├── checkout.tsx       # Checkout flow
└── product-details.tsx # Product details screen
```

## 🏗 Key Architecture Decisions

### State Management - Zustand
**Why Zustand over Redux Toolkit?**
- **Simplicity**: Less boilerplate, easier to understand
- **TypeScript**: Excellent type inference out of the box
- **Bundle Size**: Smaller footprint (~2.5kb vs ~10kb for RTK)
- **Learning Curve**: Minimal setup, familiar React patterns

### Data Fetching - TanStack Query
**Why React Query?**
- **Caching**: Intelligent background updates and cache management
- **UX**: Built-in loading, error, and optimistic update patterns
- **Performance**: Automatic request deduplication and background refetching
- **Developer Experience**: Excellent DevTools and debugging

### Cart Persistence
**Implementation:**
- Zustand persist middleware with AsyncStorage
- Automatic hydration on app startup
- Optimistic updates with error rollback
- Cross-session cart preservation

### Form Validation
**React Hook Form + Custom Validators:**
- Type-safe validation functions
- Real-time validation with minimal re-renders
- Internationalization-ready error messages
- Platform-specific input optimizations

## 🎯 Features

### Core Functionality
- ✅ Product browsing with search and filtering
- ✅ Shopping cart with quantity management
- ✅ User authentication (demo credentials)
- ✅ Checkout flow with form validation
- ✅ Responsive design for all screen sizes

### Technical Features
- ✅ TypeScript strict mode
- ✅ Error boundaries and error handling
- ✅ Loading states and optimistic updates
- ✅ Offline-first cart persistence
- ✅ Platform-specific optimizations
- ✅ Accessibility compliance
- ✅ Performance optimizations (memoization, virtualization)

## 🧪 Demo Credentials

For testing authentication:
- **Username**: `mor_2314`
- **Password**: `83r5^_`

## 📱 Supported Platforms

- ✅ iOS (iPhone & iPad)
- ✅ Android (Phone & Tablet)
- ✅ Web (responsive design)

## 🔧 Development

### Code Quality
- ESLint + Prettier configuration
- TypeScript strict mode
- Consistent import organization
- Component composition patterns

### Performance Optimizations
- React.memo for expensive components
- useCallback/useMemo for expensive calculations
- FlatList virtualization for large lists
- Image optimization and lazy loading

## 📄 License

This project is for demonstration purposes only.

---

**Built with ❤️ by Senior React Native Developer**