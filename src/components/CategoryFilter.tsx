import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { createShadow } from '../utils/platform';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  loading?: boolean;
  showLoadingIndicator?: boolean;
}

const CategoryFilter = React.memo<CategoryFilterProps>(({
  categories,
  selectedCategory,
  onCategoryChange,
  loading = false,
  showLoadingIndicator = false,
}) => {
  const allCategories = ['all', ...categories];

  const renderCategoryItem = useCallback(({ item }: { item: string }) => {
    const isActive = selectedCategory === item;
    const displayName = item === 'all' ? 'All Products' : formatCategoryName(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isActive && styles.categoryButtonActive,
        ]}
        onPress={() => onCategoryChange(item)}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Text
          style={[
            styles.categoryButtonText,
            isActive && styles.categoryButtonTextActive,
          ]}
          numberOfLines={1}
        >
          {displayName}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategory, onCategoryChange, loading]);

  const formatCategoryName = (category: string): string => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: 120,
    offset: 120 * index,
    index,
  }), []);

  if (loading && categories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allCategories}
        keyExtractor={(item) => item}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.categoryList}
        getItemLayout={getItemLayout}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={120}
        snapToAlignment="start"
      />
      
      {showLoadingIndicator && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color={COLORS.primary[600]} />
        </View>
      )}
    </View>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export { CategoryFilter };

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    position: 'relative',
  },
  
  categoryList: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  
  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    minHeight: 40,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(1, '#000', 0.05),
  },
  
  categoryButtonActive: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
    ...createShadow(2, COLORS.primary[600], 0.2),
  },
  
  categoryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  
  categoryButtonTextActive: {
    color: COLORS.text.inverse,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background.primary,
  },
  
  loadingText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  
  loadingIndicator: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.xs,
    ...createShadow(1, '#000', 0.1),
  },
});