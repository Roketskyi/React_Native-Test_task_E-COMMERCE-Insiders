import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { createShadow } from '../utils/platform';
import { useTheme } from '../contexts';

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
  const { colors } = useTheme();
  const allCategories = ['all', ...categories];

  const renderCategoryItem = useCallback(({ item }: { item: string }) => {
    const isActive = selectedCategory === item;
    const displayName = item === 'all' ? 'All Products' : formatCategoryName(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { 
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary
          },
          isActive && { 
            backgroundColor: colors.primary[600],
            borderColor: colors.primary[600]
          },
        ]}
        onPress={() => onCategoryChange(item)}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Text
          style={[
            styles.categoryButtonText,
            { color: colors.text.secondary },
            isActive && { 
              color: colors.text.inverse,
              fontFamily: TYPOGRAPHY.fontFamily.semibold
            },
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

  const getItemLayout = useCallback((_: unknown, index: number) => ({
    length: 120,
    offset: 120 * index,
    index,
  }), []);

  if (loading && categories.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="small" color={colors.primary[600]} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background.primary,
      borderBottomColor: colors.border.primary
    }]}>
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
        <View style={[styles.loadingIndicator, { backgroundColor: colors.background.primary }]}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      )}
    </View>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export { CategoryFilter };

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
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
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    minHeight: 40,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(1, '#000', 0.05),
  },
  
  categoryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  
  loadingText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  
  loadingIndicator: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.xs,
    ...createShadow(1, '#000', 0.1),
  },
});