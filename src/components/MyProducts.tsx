import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserProductsStore } from '../store/userProductsStore';
import { useAuthStore } from '../store/authStore';
import { Button, Typography, EmptyState } from './ui';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { UserProduct } from '../types';

export const MyProducts: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { products, deleteProduct } = useUserProductsStore();
  
  const userProducts = user ? products.filter(p => p.userId === user.id) : [];

  const handleCreateProduct = () => {
    router.push('/create-product');
  };

  const handleProductPress = (product: UserProduct) => {
    router.push({
      pathname: '/product-details',
      params: { 
        id: product.id,
        isUserProduct: 'true'
      }
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const renderProduct = ({ item }: { item: UserProduct }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.background.card }]}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Typography variant="body2" weight="medium" numberOfLines={2}>
          {item.title}
        </Typography>
        
        <Typography variant="caption" color="secondary" numberOfLines={2} style={styles.description}>
          {item.description}
        </Typography>
        
        <View style={styles.productFooter}>
          <Typography variant="body2" weight="bold" color="primary">
            ${item.price.toFixed(2)}
          </Typography>
          
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error + '20' }]}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (userProducts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="📦"
          title="No Products Yet"
          description="Create your first product to start selling"
          actionTitle="Create Product"
          onAction={handleCreateProduct}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h3" weight="bold">
          My Products ({userProducts.length})
        </Typography>
        
        <Button
          title="Add Product"
          onPress={handleCreateProduct}
          variant="primary"
          size="sm"
          icon="+"
        />
      </View>

      <View style={styles.productsGrid}>
        {userProducts.map((item, index) => (
          <View key={item.id} style={[styles.productWrapper, index % 2 === 1 && styles.rightProduct]}>
            {renderProduct({ item })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  productWrapper: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  
  rightProduct: {
    // Additional styling for right column if needed
  },
  
  productCard: {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  
  productInfo: {
    padding: SPACING.sm,
  },
  
  description: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});