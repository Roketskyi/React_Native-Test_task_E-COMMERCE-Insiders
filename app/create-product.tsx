import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserProductsStore } from '../src/store/userProductsStore';
import { ImagePickerService } from '../src/services/imagePickerService';
import { Button, Typography, Input } from '../src/components/ui';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAlertContext } from '../src/contexts/AlertContext';

const CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
  'books',
  'home & garden',
  'sports',
  'toys',
  'other'
];

export default function CreateProductScreen() {
  const { colors } = useTheme();
  const { alert } = useAlertContext();
  const { addProduct, isLoading } = useUserProductsStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.image) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = () => {
    ImagePickerService.showImagePickerOptions(
      async () => {
        const result = await ImagePickerService.pickFromGallery();
        if (result.success && result.uri) {
          setFormData(prev => ({ ...prev, image: result.uri! }));
          setErrors(prev => ({ ...prev, image: '' }));
        } else if (result.error) {
          alert('Error', result.error, [{ text: 'OK' }]);
        }
      },
      async () => {
        const result = await ImagePickerService.takePhoto();
        if (result.success && result.uri) {
          setFormData(prev => ({ ...prev, image: result.uri! }));
          setErrors(prev => ({ ...prev, image: '' }));
        } else if (result.error) {
          alert('Error', result.error, [{ text: 'OK' }]);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addProduct({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        image: formData.image,
      });

      alert('Success', 'Product created successfully!', [
        { 
          text: 'OK', 
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      alert('Error', 'Failed to create product. Please try again.', [
        { text: 'OK' }
      ]);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backButton, { backgroundColor: colors.background.card }]}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <Typography variant="h2" weight="bold" align="center">
              Create Product
            </Typography>
          </View>

          <View style={[styles.formContainer, { backgroundColor: colors.background.card }]}>
            <Input
              label="Product Title"
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="Enter product title"
              error={errors.title}
              required
            />

            <Input
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Describe your product"
              multiline
              numberOfLines={4}
              error={errors.description}
              required
            />

            <Input
              label="Price ($)"
              value={formData.price}
              onChangeText={(value) => updateField('price', value)}
              placeholder="0.00"
              keyboardType="numeric"
              error={errors.price}
              required
            />

            <View style={styles.categoryContainer}>
              <Typography variant="body2" weight="medium" style={styles.label}>
                Category *
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: formData.category === category 
                          ? colors.primary[600] 
                          : colors.background.tertiary,
                        borderColor: formData.category === category 
                          ? colors.primary[600] 
                          : colors.border.primary,
                      }
                    ]}
                    onPress={() => updateField('category', category)}
                  >
                    <Typography
                      variant="caption"
                      color={formData.category === category ? 'inverse' : 'primary'}
                      weight="medium"
                    >
                      {category}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.imageContainer}>
              <Typography variant="body2" weight="medium" style={styles.label}>
                Product Image *
              </Typography>
              
              <TouchableOpacity
                style={[
                  styles.imagePicker,
                  {
                    backgroundColor: colors.background.tertiary,
                    borderColor: errors.image ? colors.error : colors.border.primary,
                  }
                ]}
                onPress={handleImagePicker}
              >
                {formData.image ? (
                  <Image source={{ uri: formData.image }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.imagePickerContent}>
                    <Ionicons name="camera" size={32} color={colors.text.secondary} />
                    <Typography variant="body2" color="secondary" align="center" style={styles.imagePickerText}>
                      Tap to add photo
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
              
              {errors.image && (
                <Typography variant="caption" color="error" style={styles.errorText}>
                  {errors.image}
                </Typography>
              )}
            </View>

            <Button
              title="Create Product"
              onPress={handleSubmit}
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
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
  
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  
  formContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  
  label: {
    marginBottom: SPACING.xs,
  },
  
  categoryContainer: {
    marginBottom: SPACING.lg,
  },
  
  categoryScroll: {
    marginTop: SPACING.xs,
  },
  
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  
  imageContainer: {
    marginBottom: SPACING.lg,
  },
  
  imagePicker: {
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
  },
  
  imagePickerContent: {
    alignItems: 'center',
  },
  
  imagePickerText: {
    marginTop: SPACING.sm,
  },
  
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
  },
  
  errorText: {
    marginTop: SPACING.xs,
  },
  
  submitButton: {
    marginTop: SPACING.md,
  },
});