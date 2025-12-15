import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useProducts, useCategories, useProductsByCategory, useDebounce } from '../../src/hooks';
import { ProductGrid } from '../../src/components/ProductGrid';
import { CategoryFilter } from '../../src/components/CategoryFilter';
import { SearchBar } from '../../src/components/SearchBar';
import { Typography, EmptyState } from '../../src/components/ui';
import { SPACING } from '../../src/constants/theme';
import { Product } from '../../src/types';
import { ApiError } from '../../src/services/api';
import { useTheme } from '../../src/contexts';

const SEARCH_DEBOUNCE_MS = 300;

export default function HomeScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Debounce search query for better performance
  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // Smart data fetching based on category selection
  const allProductsQuery = useProducts(undefined, { enabled: selectedCategory === 'all' });
  const categoryProductsQuery = useProductsByCategory(selectedCategory, { 
    enabled: selectedCategory !== 'all' 
  });
  
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Determine which query to use
  const activeQuery = selectedCategory === 'all' ? allProductsQuery : categoryProductsQuery;
  const { data: products, isLoading, error, refetch, isFetching } = activeQuery;

  // Filter products by search query (category filtering is handled by separate queries)
  const filteredProducts = useMemo(() => {
    if (!products?.length) return [];
    
    if (!debouncedSearch.trim()) return products;
    
    const query = debouncedSearch.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [products, debouncedSearch]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    try {
      router.push({
        pathname: '/product-details' as any,
        params: {
          id: product.id.toString(),
          title: product.title,
          price: product.price.toString(),
          description: product.description,
          category: product.category,
          image: product.image,
          rating_rate: product.rating.rate.toString(),
          rating_count: product.rating.count.toString(),
        },
      });
    } catch (error) {
      // Handle navigation error silently
    }
  }, []);

  const renderError = () => {
    const apiError = error as ApiError;
    let errorMessage = 'Failed to load products';
    let errorIcon = '⚠️';
    
    if (apiError?.code === 'NETWORK_ERROR') {
      errorMessage = 'Please check your internet connection';
      errorIcon = '📡';
    } else if (apiError?.code === 'TIMEOUT') {
      errorMessage = 'Request timed out. Please try again';
      errorIcon = '⏱️';
    } else if (apiError?.message) {
      errorMessage = apiError.message;
    }

    return (
      <EmptyState
        icon={errorIcon}
        title="Something went wrong"
        description={errorMessage}
        actionTitle="Try Again"
        onAction={refetch}
      />
    );
  };

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search products..."
        loading={isLoading}
      />

      <CategoryFilter
        categories={categories || []}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        loading={categoriesLoading}
        showLoadingIndicator={isFetching && !isLoading}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />

          <Typography variant="body2" color="secondary" style={styles.loadingText}>
            Loading products...
          </Typography>
        </View>
      ) : (
        <ProductGrid
          products={filteredProducts}
          loading={isLoading}
          refreshing={isFetching}
          onRefresh={refetch}
          onProductPress={handleProductPress}
          emptyStateConfig={{
            icon: debouncedSearch ? "🔍" : "📦",
            title: debouncedSearch ? "No products found" : "No products available",
            description: debouncedSearch 
              ? `No results for "${debouncedSearch}". Try a different search term.`
              : "Try adjusting your category filter or check back later.",
            actionTitle: "Refresh",
            onAction: refetch,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: SPACING.md,
  },
});