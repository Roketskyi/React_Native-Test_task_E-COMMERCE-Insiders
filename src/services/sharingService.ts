import { Share, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { Product, UserProduct } from '../types';

export interface ShareResult {
  success: boolean;
  error?: string;
}

export class SharingService {
  private static readonly APP_SCHEME = 'rntestproject';
  private static readonly DOMAIN = 'rntestproject.app';

  static createProductDeepLink(productId: string | number, isUserProduct: boolean = false): string {
    const url = Linking.createURL('/product-details', {
      queryParams: {
        id: productId.toString(),
        isUserProduct: isUserProduct.toString()
      }
    });
    
    return url;
  }

  static async shareProduct(
    product: Product | UserProduct,
    isUserProduct: boolean = false
  ): Promise<ShareResult> {
    try {
      const deepLink = this.createProductDeepLink(product.id, isUserProduct);
      
      const shareContent = {
        title: `Check out this product: ${product.title}`,
        message: Platform.OS === 'ios' 
          ? `${product.title}\n\n${product.description}\n\nPrice: $${product.price}\n\nOpen in app: ${deepLink}`
          : `${product.title}\n\n${product.description}\n\nPrice: $${product.price}\n\nOpen in app: ${deepLink}`,
        url: Platform.OS === 'ios' ? deepLink : undefined,
      };

      const result = await Share.share(shareContent, {
        dialogTitle: 'Share Product',
        subject: `Check out this product: ${product.title}`,
      });

      if (result.action === Share.sharedAction) {
        return { success: true };
      } else if (result.action === Share.dismissedAction) {
        return { success: false, error: 'Share was dismissed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to share product:', error);
      return {
        success: false,
        error: 'Failed to share product'
      };
    }
  }

  static parseDeepLink(url: string): { productId?: string; isUserProduct?: boolean } | null {
    try {
      const parsed = Linking.parse(url);
      
      if (parsed.path === '/product-details' && parsed.queryParams) {
        return {
          productId: parsed.queryParams.id as string,
          isUserProduct: parsed.queryParams.isUserProduct === 'true'
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to parse deep link:', error);
      return null;
    }
  }

  static async handleIncomingLink(url: string): Promise<boolean> {
    try {
      const linkData = this.parseDeepLink(url);
      
      if (linkData?.productId) {
        console.log('Handling deep link for product:', linkData.productId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to handle incoming link:', error);
      return false;
    }
  }

  static async canShare(): Promise<boolean> {
    try {
      return await Share.share({ message: 'test' }, { dialogTitle: 'test' })
        .then(() => true)
        .catch(() => false);
    } catch {
      return false;
    }
  }

  static getShareableText(product: Product | UserProduct, isUserProduct: boolean = false): string {
    const productType = isUserProduct ? 'user product' : 'product';
    return `Check out this ${productType}: ${product.title}\n\nPrice: $${product.price}\n\n${product.description}`;
  }
}