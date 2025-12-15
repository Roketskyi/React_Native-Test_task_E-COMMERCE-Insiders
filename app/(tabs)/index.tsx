import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts, useCategories } from '../../src/hooks';
import { ProductCard } from '../../src/components/ProductCard';
import { Typography } from '../../src/components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../src/constants/theme';
import { Product } from '../../src/types';

const SEARCH_FIELDS = ['title', 'description', 'category'] as const;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: products, isLoading, error, refetch } = useProducts();
  const { data: categories } = useCategories();

  const filteredProducts = useMemo(() => {
    if (!products?.length) return [];
    
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        SEARCH_FIELDS.some(field => 
          product[field].toLowerCase().includes(query)
        )
      );
    }
    
    return filtered;
  }, [products, searchQuery, selectedCategory]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} />
  ), []);

  const allCategories = useMemo(() => 
    ['all', ...(categories || [])], [categories]
  );

  const renderCategoryItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive,
      ]}

      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item && styles.categoryButtonTextActive,
        ]}
      >
        {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  ), [selectedCategory]);

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Typography variant="h3" color="error" align="center">
            Oops! Something went wrong
          </Typography>

          <Typography variant="body2" color="secondary" align="center" style={styles.errorText}>
            {error.message || 'Failed to load products'}
          </Typography>

          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.text.tertiary}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={allCategories}
          keyExtractor={(item) => item}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.categoryList}
          getItemLayout={(_, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />

          <Typography variant="body2" color="secondary" style={styles.loadingText}>
            Loading products...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[COLORS.primary[600]]}
              tintColor={COLORS.primary[600]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="h4" color="secondary" align="center">
                No products found
              </Typography>
              
              <Typography variant="body2" color="tertiary" align="center" style={styles.emptyText}>
                Try adjusting your search or category filter
              </Typography>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  
  searchIcon: {
    fontSize: 16,
    color: COLORS.text.tertiary,
    marginRight: SPACING.sm,
  },
  
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.primary,
    paddingVertical: 0,
  },
  
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  
  clearButtonText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
  
  categoryContainer: {
    backgroundColor: COLORS.background.primary,
    paddingBottom: SPACING.sm,
  },
  
  categoryList: {
    paddingHorizontal: SPACING.md,
  },
  
  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  categoryButtonActive: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  
  categoryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
  },
  
  categoryButtonTextActive: {
    color: COLORS.text.inverse,
  },
  
  productsList: {
    padding: SPACING.md,
  },
  
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: SPACING.md,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  
  errorText: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  
  retryButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  
  retryButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING['2xl'],
    minHeight: 200,
  },
  
  emptyText: {
    marginTop: SPACING.sm,
  },
});