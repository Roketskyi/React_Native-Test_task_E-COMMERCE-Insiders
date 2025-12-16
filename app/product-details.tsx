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
import { useUserProductsStore } from '../src/store/userProductsStore';
import { SharingService } from '../src/services/sharingService';
import { TYPOGRAPHY, SPACING } from '../src/constants/theme';
import { createShadow } from '../src/utils/platform';
import { AnimatedButton } from '../src/components/ui/AnimatedButton';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAlertContext } from '../src/contexts/AlertContext';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.4;

export default function ProductDetailsScreen() {
  const { colors } = useTheme();
  const { alert } = useAlertContext();
  const params = useLocalSearchParams();
  const { addItem, isItemInCart, getItemQuantity } = useCartStore();
  const { products: userProducts } = useUserProductsStore();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const isUserProduct = params.isUserProduct === 'true';

  const product: Product = useMemo(() => {
    try {
      if (isUserProduct) {
        const userProduct = userProducts.find(p => p.id === String(params.id));

        if (userProduct) {
          return {
            id: parseInt(userProduct.id) || Math.random() * 1000000,
            title: userProduct.title,
            price: userProduct.price,
            description: userProduct.description,
            category: userProduct.category,
            image: userProduct.image,
            rating: {
              rate: 5.0,
              count: 1,
            },
          };
        }
      }
      
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
      return {} as Product;
    }
  }, [params]);

  const isInCart = isItemInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = useCallback(() => {
    addItem(product);
  }, [addItem, product]);

  const handleShare = useCallback(async () => {
    try {
      const result = await SharingService.shareProduct(product);
      
      if (!result.success && result.error !== 'Share was dismissed') {
        alert('Share Error', result.error || 'Failed to share product', [{ text: 'OK' }]);
      }
    } catch (error) {
      alert('Share Error', 'Failed to share product', [{ text: 'OK' }]);
    }
  }, [product, alert]);

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
      <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        <SafeAreaView style={[styles.errorContainer, { backgroundColor: colors.background.primary }]} edges={['top', 'bottom']}>
          <View style={[styles.errorContent, { backgroundColor: colors.background.secondary }]}>
            <Text style={styles.errorIcon}>🔍</Text>
            <Text style={[styles.errorTitle, { color: colors.text.primary }]}>Product Not Found</Text>
            <Text style={[styles.errorText, { color: colors.text.secondary }]}>
              Sorry, we couldn't find the product you're looking for.
            </Text>

            <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.primary[600] }]}>
              <Text style={[styles.backButtonText, { color: colors.text.inverse }]}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={[styles.imageContainer, { backgroundColor: colors.background.primary }]}>
          {imageLoading && (
            <View style={[styles.imageLoader, { backgroundColor: colors.background.primary }]}>
              <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
          )}

          {imageError ? (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.background.tertiary }]}>
              <Text style={styles.imagePlaceholderText}>📷</Text>
              <Text style={[styles.imagePlaceholderSubtext, { color: colors.text.tertiary }]}>Image not available</Text>
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

        <View style={[styles.contentCard, { backgroundColor: colors.background.card }]}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary[100] || colors.primary[200] }]}>
            <Text style={[styles.category, { color: colors.primary[600] }]}>
              {product.category?.toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text.primary }]}>
            {product.title}
          </Text>

          <View style={styles.ratingSection}>
            <View style={[styles.ratingContainer, { backgroundColor: colors.background.tertiary }]}>
              <Text style={styles.starIcon}>⭐</Text>

              <Text style={[styles.ratingValue, { color: colors.text.primary }]}>
                {product.rating?.rate?.toFixed(1) || '0.0'}
              </Text>
            </View>
            <Text style={[styles.reviewCount, { color: colors.text.tertiary }]}>
              ({product.rating?.count || 0} reviews)
            </Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>Price</Text>
            <Text style={[styles.price, { color: colors.primary[600] }]}>
              ${formattedPrice}
            </Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={[styles.descriptionTitle, { color: colors.text.primary }]}>About this product</Text>

            <View style={[styles.descriptionCard, { 
              backgroundColor: colors.background.tertiary,
              borderLeftColor: colors.primary[600]
            }]}>
              <Text style={[styles.description, { color: colors.text.secondary }]}>
                {product.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView style={[styles.bottomSafeArea, { backgroundColor: colors.background.primary }]} edges={['bottom']}>
        <View style={[styles.buttonContainer, { 
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.primary
        }]}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: colors.background.tertiary }]}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Text style={styles.shareIcon}>📤</Text>
            </TouchableOpacity>
            
            <View style={styles.addToCartButton}>
              <AnimatedButton
                onPress={handleAddToCart}
                title={buttonTitle}
                isInCart={isInCart}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 80,
  },
  
  imageContainer: {
    height: IMAGE_HEIGHT,
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
  },
  
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  
  contentCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 16,
    padding: SPACING.lg,
    ...createShadow(2, '#000', 0.08),
  },
  
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  
  category: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    letterSpacing: 0.5,
  },
  
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    lineHeight: 32,
    marginBottom: SPACING.lg,
  },
  
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  
  reviewCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  
  priceSection: {
    marginBottom: SPACING.xl,
  },
  
  priceLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    marginBottom: SPACING.xs,
  },
  
  price: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
  
  descriptionSection: {
    marginBottom: SPACING.md,
  },
  
  descriptionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    marginBottom: SPACING.md,
  },
  
  descriptionCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    lineHeight: 24,
  },
  
  bottomSafeArea: {
    // Dynamic background
  },
  
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    ...createShadow(8, '#000', 0.15),
  },
  
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  
  shareButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow(2, '#000', 0.1),
  },
  
  shareIcon: {
    fontSize: 20,
  },
  
  addToCartButton: {
    flex: 1,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  errorContent: {
    alignItems: 'center',
    padding: SPACING.xl,
    margin: SPACING.lg,
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
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    ...createShadow(2, '#000', 0.3),
  },
  
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
  },
});