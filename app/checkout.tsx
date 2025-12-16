import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';

import { useCartStore } from '../src/store';
import { Button, Typography, Input, Loading } from '../src/components/ui';
import { LocationService } from '../src/services/locationService';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { VALIDATION, MESSAGES, NAVIGATION_ROUTES } from '../src/constants/app';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAlertContext } from '../src/contexts/AlertContext';

type CheckoutFormData = {
  name: string;
  phone: string;
  address: string;
};

/**
 * Validates user name input
 * Checks for required field, length limits, and allowed characters (letters and spaces only)
 */
const validateName = (value: string): string | undefined => {
  if (!value) return 'Name is required';
  if (value.length < VALIDATION.MIN_NAME_LENGTH) return `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`;
  if (value.length > VALIDATION.MAX_NAME_LENGTH) return `Name must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`;
  if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';

  return undefined;
};

/**
 * Validates phone number input
 * Accepts international format with optional + prefix and digits only
 */
const validatePhone = (value: string): string | undefined => {
  if (!value) return 'Phone number is required';
  if (value.length < VALIDATION.MIN_PHONE_LENGTH) return `Phone number must be at least ${VALIDATION.MIN_PHONE_LENGTH} digits`;
  if (value.length > VALIDATION.MAX_PHONE_LENGTH) return `Phone number must be less than ${VALIDATION.MAX_PHONE_LENGTH} digits`;
  if (!/^\+?[0-9]+$/.test(value)) return 'Phone number can only contain digits and optional + at the beginning';
  
  return undefined;
};

const validateAddress = (value: string): string | undefined => {
  if (!value) return 'Address is required';
  if (value.length < VALIDATION.MIN_ADDRESS_LENGTH) return `Address must be at least ${VALIDATION.MIN_ADDRESS_LENGTH} characters`;
  if (value.length > VALIDATION.MAX_ADDRESS_LENGTH) return `Address must be less than ${VALIDATION.MAX_ADDRESS_LENGTH} characters`;

  return undefined;
};

/**
 * Checkout screen with order form and validation
 * Handles user input for name, phone, and address with React Hook Form
 */
export default function CheckoutScreen() {
  const { colors } = useTheme();
  const { alert } = useAlertContext();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  const formValues = watch();
  const isValid = !validateName(formValues.name) && 
                  !validatePhone(formValues.phone) && 
                  !validateAddress(formValues.address) &&
                  formValues.name && formValues.phone && formValues.address;

  const orderSummary = {
    subtotal: totalPrice,
    tax: Math.round(totalPrice * VALIDATION.TAX_RATE * 100) / 100,
    total: Math.round((totalPrice + totalPrice * VALIDATION.TAX_RATE) * 100) / 100,
  };

  const onSubmit = useCallback(async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      
      alert(
        MESSAGES.ORDER_SUCCESS,
        `Thank you, ${data.name}!\n\nYour order for $${orderSummary.total.toFixed(2)} has been received and is being processed.\n\nWe will contact you at ${data.phone} to confirm delivery details.`,
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              router.replace(NAVIGATION_ROUTES.TABS);
            },
          },
        ]
      );
    } catch (error) {
      alert(
        'Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [clearCart, orderSummary.total, reset, router]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleGetLocation = useCallback(async () => {
    setIsGettingLocation(true);
    
    try {
      const result = await LocationService.getLocationWithAddress();
      
      if (result.success && result.address) {
        setValue('address', result.address);
        
        const isCoordinatesOnly = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(result.address);
        
        if (isCoordinatesOnly) {
          alert(
            'Location Found',
            `Your coordinates have been added: ${result.address}\n\nNote: Address lookup is currently unavailable. You may want to add more details manually.`,
            [{ text: 'OK' }]
          );
        } else {
          alert(
            'Location Found',
            `Your current location has been added to the address field: ${result.address}`,
            [{ text: 'OK' }]
          );
        }
      } else {
        alert(
          'Location Error',
          result.error || 'Could not get your location. Please enter your address manually.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Location error:', error);
      
      alert(
        'Location Error',
        'Failed to get your location. Please enter your address manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGettingLocation(false);
    }
  }, [setValue, alert]);

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        <View style={styles.emptyContainer}>
          <Typography variant="h3" style={styles.emptyTitle}>
            Cart is Empty
          </Typography>

          <Typography variant="body1" color="secondary" style={styles.emptyDescription}>
            Add some products to your cart to place an order
          </Typography>

          <Button
            title="Continue Shopping"
            onPress={() => router.replace('/(tabs)')}
            variant="primary"
            style={styles.emptyButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.header, { 
            backgroundColor: colors.background.primary,
            borderBottomColor: colors.border.primary
          }]}>
            <Typography variant="h3" weight="bold">
              Checkout
            </Typography>

            <Typography variant="body2" color="secondary">
              Fill in your delivery details
            </Typography>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.background.card }]}>
            <Typography variant="h4" weight="bold" style={styles.summaryTitle}>
              Your Order
            </Typography>
            
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="secondary">
                Items ({items.length})
              </Typography>

              <Typography variant="body1" weight="medium">
                ${orderSummary.subtotal.toFixed(2)}
              </Typography>
            </View>
            
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="secondary">
                Tax
              </Typography>

              <Typography variant="body1" weight="medium">
                ${orderSummary.tax.toFixed(2)}
              </Typography>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border.primary }]}>
              <Typography variant="h4" weight="bold">
                Total
              </Typography>

              <Typography variant="h4" weight="bold" color="primary">
                ${orderSummary.total.toFixed(2)}
              </Typography>
            </View>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.background.card }]}>
            <Typography variant="h4" weight="bold" style={styles.formTitle}>
              Contact Details
            </Typography>

            <Controller
              control={control}
              name="name"
              rules={{ validate: validateName }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Name *"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    // Focus next input - phone
                  }}
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              rules={{ validate: validatePhone }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone *"
                  placeholder="+1234567890"
                  value={value}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^+0-9]/g, '');
                    if (cleaned.startsWith('+')) {
                      onChange(cleaned);
                    } else {
                      onChange(cleaned.replace(/\+/g, ''));
                    }
                  }}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    // Focus next input - address
                  }}
                  style={styles.input}
                />
              )}
            />

            <View style={styles.addressContainer}>
              <Controller
                control={control}
                name="address"
                rules={{ validate: validateAddress }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Delivery Address *"
                    placeholder="Enter your full delivery address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.address?.message}
                    multiline
                    numberOfLines={3}
                    autoCapitalize="sentences"
                    autoComplete="street-address"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    style={styles.textArea}
                  />
                )}
              />
              
              <Button
                title="Use Current Location"
                onPress={handleGetLocation}
                variant="info"
                size="sm"
                loading={isGettingLocation}
                disabled={isGettingLocation}
                icon="📍"
                style={styles.locationButton}
              />
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomActions, { 
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.primary
        }]}>
          <Button
            title="Place Order"
            onPress={handleSubmit(onSubmit)}
            variant="success"
            size="lg"
            fullWidth
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            icon="✅"
            style={styles.submitButton}
          />
          
          <Button
            title="Back to Cart"
            onPress={handleGoBack}
            variant="subtle"
            size="md"
            fullWidth
            disabled={isSubmitting}
            icon="🛒"
            style={styles.backButton}
          />
        </View>

        {isSubmitting && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.background.overlay }]}>
            <Loading size="large" />

            <Typography variant="body1" style={styles.loadingText}>
              Processing your order...
            </Typography>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  keyboardAvoid: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: SPACING.xs,
  },
  
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  
  summaryCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  
  summaryTitle: {
    marginBottom: SPACING.md,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  totalRow: {
    borderTopWidth: 1,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: 0,
  },
  
  formCard: {
    margin: SPACING.md,
    marginTop: 0,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  
  formTitle: {
    marginBottom: SPACING.lg,
  },
  
  input: {
    marginBottom: SPACING.md,
  },
  
  textArea: {
    minHeight: 80,
  },
  
  addressContainer: {
    marginBottom: SPACING.md,
  },
  
  locationButton: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  
  bottomActions: {
    padding: SPACING.md,
    paddingBottom: SPACING.xs + 16,
    borderTopWidth: 1,
    gap: SPACING.xs,
  },
  
  submitButton: {
    marginBottom: SPACING.xs,
  },
  
  backButton: {
    // Additional styles if needed
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  emptyTitle: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  
  emptyDescription: {
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  
  emptyButton: {
    minWidth: 200,
  },
});