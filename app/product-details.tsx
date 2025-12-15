import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../src/types';
import { useCartStore } from '../src/store';
import { COLORS, TYPOGRAPHY, SPACING } from '../src/constants/theme';
import { createShadow } from '../src/utils/platform';
import { AnimatedButton } from '../src/components/ui/AnimatedButton';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.4;

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const { addItem, isItemInCart, getItemQuantity } = useCartStore();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  console.log('ProductDetailsScreen loaded with params:', params);

  // Parse product data from params
  const product: Product = useMemo(() => {
    try {
      return {
        id: Number(params.id),
        title: String(params.title || ''),
        price: Number(params.price || 0),
        description: String(params.description || ''),
        category: String(params.category || ''),
        image: String(params.image || ''),
        rating: {
          rate: Number(params.rating_rate || 0),
          count: Number(params.rating_count || 0),
        },
      };
    } catch (error) {
      console.error('Error parsing product params:', error);
      return {} as Product;
    }
  }, [params]);

  const isInCart = isItemInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = useCallback(() => {
    addItem(product);
  }, [addItem, product]);

  const handleImageLoadStart = useCallback(() => setImageLoading(true), []);
  const handleImageLoadEnd = useCallback(() => setImageLoading(false), []);
  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const buttonTitle = useMemo(() => {
    if (isInCart) {
      return quantity > 1 ? `In Cart (${quantity})` : 'Added ✓';
    }
    return 'Add to Cart';
  }, [isInCart, quantity]);

  const formattedPrice = product.price?.toFixed(2) || '0.00';

  if (!product.id) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.errorContainer} edges={['top', 'bottom']}>
          <View style={styles.errorContent}>
            <Text style={styles.errorIcon}>🔍</Text>
            <Text style={styles.errorTitle}>Product Not Found</Text>
            <Text style={styles.errorText}>
              Sorry, we couldn't find the product you're looking for.
            </Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imageLoader}>
              <ActivityIndicator size="large" color={COLORS.primary[600]} />
            </View>
          )}

          {imageError ? (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>📷</Text>
              <Text style={styles.imagePlaceholderSubtext}>Image not available</Text>
            </View>
          ) : (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
              onLoadStart={handleImageLoadStart}
              onLoadEnd={handleImageLoadEnd}
              onError={handleImageError}
            />
          )}
        </View>

        {/* Product Info Card */}
        <View style={styles.contentCard}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.category}>
              {product.category?.toUpperCase()}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {product.title}
          </Text>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingValue}>
                {product.rating?.rate?.toFixed(1) || '0.0'}
              </Text>
            </View>
            <Text style={styles.reviewCount}>
              ({product.rating?.count || 0} reviews)
            </Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>
              ${formattedPrice}
            </Text>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>About this product</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.description}>
                {product.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <AnimatedButton
            onPress={handleAddToCart}
            title={buttonTitle}
            isInCart={isInCart}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 80, // Space for fixed button
  },
  
  // Hero Image Section
  imageContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: COLORS.background.primary,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  productImage: {
    width: width * 0.85,
    height: IMAGE_HEIGHT * 0.85,
  },
  
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
  },
  
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[100],
    width: '100%',
    height: '100%',
  },
  
  imagePlaceholderText: {
    fontSize: 64,
    opacity: 0.3,
    marginBottom: SPACING.sm,
  },
  
  imagePlaceholderSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.tertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  
  // Content Card
  contentCard: {
    backgroundColor: COLORS.background.primary,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 16,
    padding: SPACING.lg,
    ...createShadow(2, '#000', 0.08),
  },
  
  // Category Badge
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary[50] || COLORS.primary[100],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  
  category: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.primary[600],
    letterSpacing: 0.5,
  },
  
  // Title
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
    lineHeight: 32,
    marginBottom: SPACING.lg,
  },
  
  // Rating Section
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  
  starIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  
  ratingValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.text.primary,
  },
  
  reviewCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.tertiary,
  },
  
  // Price Section
  priceSection: {
    marginBottom: SPACING.xl,
  },
  
  priceLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  
  price: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary[600],
  },
  
  // Description Section
  descriptionSection: {
    marginBottom: SPACING.md,
  },
  
  descriptionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  
  descriptionCard: {
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary[600],
  },
  
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  
  // Bottom Button
  bottomSafeArea: {
    backgroundColor: COLORS.background.primary,
  },
  
  buttonContainer: {
    backgroundColor: COLORS.background.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    ...createShadow(8, '#000', 0.15),
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
  },
  
  errorContent: {
    alignItems: 'center',
    padding: SPACING.xl,
    margin: SPACING.lg,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 16,
    ...createShadow(2, '#000', 0.08),
  },
  
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  
  backButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    ...createShadow(2, COLORS.primary[600], 0.3),
  },
  
  backButtonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
  },
});