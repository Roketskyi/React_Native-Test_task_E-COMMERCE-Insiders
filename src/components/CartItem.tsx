import React, { memo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Typography } from './ui/Typography';
import { QuantitySelector } from './ui/QuantitySelector';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { CartItemType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { alertService } from '../services/alertService';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  isLoading?: boolean;
}

export const CartItem: React.FC<CartItemProps> = memo(({
  item,
  onQuantityChange,
  onRemove,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  const subtotal = Math.round(item.price * item.quantity * 100) / 100;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveConfirm();
    } else {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleRemoveConfirm = () => {
    alertService.alert(
      'Remove Item',
      `Remove "${item.title}" from your cart?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: handleRemoveWithAnimation,
        },
      ]
    );
  };

  const handleRemoveWithAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(item.id);
    });
  };

  const formatCategory = (category: string) => {
    return category.replace(/'/g, '').toUpperCase();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background.card },
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
        isLoading && styles.containerLoading,
      ]}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.background.tertiary }]}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Typography 
            variant="body1" 
            weight="medium" 
            numberOfLines={2} 
            style={styles.title}
          >
            {item.title}
          </Typography>
          
          <TouchableOpacity
            style={[styles.removeButton, { backgroundColor: colors.background.tertiary }]}
            onPress={handleRemoveConfirm}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Typography variant="caption" color="error">
              ✕
            </Typography>
          </TouchableOpacity>
        </View>
        
        <Typography 
          variant="caption" 
          color="secondary" 
          style={styles.category}
        >
          {formatCategory(item.category)}
        </Typography>
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Typography variant="body2" color="secondary">
              ${item.price.toFixed(2)} each
            </Typography>

            <Typography variant="body1" weight="bold" color="primary">
              ${subtotal.toFixed(2)}
            </Typography>
          </View>
          
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
            disabled={isLoading}
            size="md"
          />
        </View>
      </View>
    </Animated.View>
  );
});

CartItem.displayName = 'CartItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  
  containerLoading: {
    opacity: 0.7,
  },
  
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  content: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  
  title: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  
  removeButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  category: {
    marginBottom: SPACING.sm,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  
  priceContainer: {
    flex: 1,
  },
});