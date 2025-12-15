import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Product } from '../types';
import { useCartStore } from '../store';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { createShadow } from '../utils/platform';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.md * 3) / 2;
const MAX_TITLE_LENGTH = 35;

const ProductCard = React.memo<ProductCardProps>(({ product, onPress }) => {
  const { addItem, isItemInCart, getItemQuantity } = useCartStore();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const isInCart = isItemInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to product details with product data
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
    }
  }, [onPress, product]);

  const handleAddToCart = useCallback((e: any) => {
    e.stopPropagation();
    addItem(product);
  }, [addItem, product]);

  const handleImageLoadStart = useCallback(() => setImageLoading(true), []);
  const handleImageLoadEnd = useCallback(() => setImageLoading(false), []);
  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const formattedPrice = useMemo(() => `$${product.price.toFixed(2)}`, [product.price]);
  const truncatedTitle = useMemo(() => 
    product.title.length > MAX_TITLE_LENGTH 
      ? `${product.title.substring(0, MAX_TITLE_LENGTH)}...` 
      : product.title,
    [product.title]
  );

  const buttonTitle = useMemo(() => 
    isInCart ? (quantity > 1 ? `${quantity}` : '✓') : 'Add',
    [isInCart, quantity]
  );

  const ratingText = useMemo(() => 
    `⭐ ${product.rating.rate.toFixed(1)}`,
    [product.rating.rate]
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator size="small" color={COLORS.primary[600]} />
          </View>
        )}

        {imageError ? (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📷</Text>
          </View>
        ) : (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
            onError={handleImageError}
          />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category.toUpperCase()}
        </Text>
        
        <Text style={styles.title} numberOfLines={2}>
          {truncatedTitle}
        </Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.ratingBadge}>
            <Text style={styles.rating}>{ratingText}</Text>
          </View>

          <Text style={styles.ratingCount}>({product.rating.count})</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>{formattedPrice}</Text>
          
          <TouchableOpacity
            style={[styles.addButton, isInCart && styles.addButtonActive]}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={[styles.addButtonText, isInCart && styles.addButtonTextActive]}>
              {buttonTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ProductCard.displayName = 'ProductCard';

export { ProductCard };

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...createShadow(2, '#000', 0.08),
  },
  
  imageContainer: {
    height: 140,
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.md,
    position: 'relative',
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
  },
  
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[100],
  },
  
  imagePlaceholderText: {
    fontSize: 32,
    opacity: 0.5,
  },
  
  content: {
    padding: SPACING.md,
    flex: 1,
  },
  
  category: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.primary[600],
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  
  title: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
    minHeight: 36,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  ratingBadge: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
  },
  
  rating: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
  },
  
  ratingCount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.tertiary,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary[600],
    flex: 1,
  },
  
  addButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow(1, '#000', 0.1),
  },
  
  addButtonActive: {
    backgroundColor: COLORS.success,
  },
  
  addButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.text.inverse,
  },
  
  addButtonTextActive: {
    color: COLORS.text.inverse,
  },
});