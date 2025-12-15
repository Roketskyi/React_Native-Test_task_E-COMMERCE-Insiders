import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from './ui';
import { COLORS, SPACING } from '../constants/theme';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onProductPress?: (product: Product) => void;
  emptyStateConfig?: {
    icon?: string;
    title?: string;
    description?: string;
    actionTitle?: string;
    onAction?: () => void;
  };
}

const COLUMN_COUNT = 2;

const ProductGrid = React.memo<ProductGridProps>(({
  products,
  loading = false,
  refreshing = false,
  onRefresh,
  onProductPress,
  emptyStateConfig,
}) => {
  const renderProduct: ListRenderItem<Product> = useCallback(({ item }) => (
    <ProductCard
      product={item}
      onPress={() => onProductPress?.(item)}
    />
  ), [onProductPress]);

  const getItemLayout = useCallback((_: any, index: number) => {
    const itemHeight = 280; // Approximate card height
    const row = Math.floor(index / COLUMN_COUNT);
    return {
      length: itemHeight,
      offset: itemHeight * row,
      index,
    };
  }, []);

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    
    return (
      <EmptyState
        icon={emptyStateConfig?.icon || "🔍"}
        title={emptyStateConfig?.title || "No products found"}
        description={emptyStateConfig?.description || "Try adjusting your search or filters"}
        {...(emptyStateConfig?.actionTitle && { actionTitle: emptyStateConfig.actionTitle })}
        {...(emptyStateConfig?.onAction && { onAction: emptyStateConfig.onAction })}
      />
    );
  }, [loading, emptyStateConfig]);

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={keyExtractor}
      numColumns={COLUMN_COUNT}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[
        styles.container,
        products.length === 0 && styles.emptyContainer,
      ]}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      maxToRenderPerBatch={8}
      windowSize={10}
      initialNumToRender={6}
      getItemLayout={getItemLayout}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary[600]]}
            tintColor={COLORS.primary[600]}
            progressBackgroundColor={COLORS.background.primary}
          />
        ) : undefined
      }
      ListEmptyComponent={renderEmpty}
    />
  );
});

ProductGrid.displayName = 'ProductGrid';

export { ProductGrid };

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  
  emptyContainer: {
    flexGrow: 1,
  },
  
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
});