import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../src/store';
import { Button, Typography } from '../../src/components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { CartItem } from '../../src/types';

export default function CartScreen() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeItem(productId) },
        ]
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Total: $${totalPrice.toFixed(2)}\n\nThis is a demo app. Checkout functionality would be implemented here.`,
      [{ text: 'OK' }]
    );
  };

  const renderCartItem = useCallback(({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
      
      <View style={styles.itemDetails}>
        <Typography variant="body1" weight="medium" numberOfLines={2} style={styles.itemTitle}>
          {item.title}
        </Typography>
        
        <Typography variant="caption" color="secondary" style={styles.itemCategory}>
          {item.category.toUpperCase()}
        </Typography>
        
        <View style={styles.priceQuantityContainer}>
          <Typography variant="body1" weight="bold" color="primary">
            ${item.price.toFixed(2)}
          </Typography>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
            >
              <Typography variant="body1" weight="bold" color="primary">
                -
              </Typography>
            </TouchableOpacity>
            
            <View style={styles.quantityDisplay}>
              <Typography variant="body1" weight="medium">
                {item.quantity}
              </Typography>
            </View>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <Typography variant="body1" weight="bold" color="primary">
                +
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.itemFooter}>
          <Typography variant="body2" weight="bold">
            Subtotal: ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Typography variant="caption" color="error">
              Remove
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [handleQuantityChange, removeItem]);

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Typography variant="h1" style={styles.emptyIcon}>🛒</Typography>
      </View>
      
      <Typography variant="h3" color="secondary" align="center" style={styles.emptyTitle}>
        Your cart is empty
      </Typography>

      <Typography variant="body2" color="tertiary" align="center" style={styles.emptyText}>
        Add some products to get started shopping
      </Typography>
    </View>
  );

  const renderCartSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <Typography variant="body1" color="secondary">
          Items ({totalItems})
        </Typography>

        <Typography variant="body1" weight="medium">
          ${totalPrice.toFixed(2)}
        </Typography>
      </View>
      
      <View style={styles.summaryRow}>
        <Typography variant="body1" color="secondary">
          Shipping
        </Typography>

        <Typography variant="body1" weight="medium" color="success">
          Free
        </Typography>
      </View>
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Typography variant="h4" weight="bold">
          Total
        </Typography>

        <Typography variant="h4" weight="bold" color="primary">
          ${totalPrice.toFixed(2)}
        </Typography>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Checkout"
          onPress={handleCheckout}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.checkoutButton}
        />
        
        <Button
          title="Clear Cart"
          onPress={handleClearCart}
          variant="outline"
          size="md"
          fullWidth
          style={styles.clearButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          {renderCartSummary()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  
  cartList: {
    padding: SPACING.md,
  },
  
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
  },
  
  itemDetails: {
    flex: 1,
  },
  
  itemTitle: {
    marginBottom: SPACING.xs,
  },
  
  itemCategory: {
    marginBottom: SPACING.sm,
  },
  
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
  },
  
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  quantityDisplay: {
    paddingHorizontal: SPACING.md,
    minWidth: 40,
    alignItems: 'center',
  },
  
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  removeButton: {
    padding: SPACING.xs,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  
  emptyIcon: {
    fontSize: 48,
    opacity: 0.6,
  },
  
  emptyTitle: {
    marginBottom: SPACING.sm,
  },
  
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  
  summaryContainer: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.lg,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    paddingTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  
  buttonContainer: {
    gap: SPACING.sm,
  },
  
  checkoutButton: {
    marginBottom: SPACING.xs,
  },
  
  clearButton: {
    // Additional styles if needed
  },
});