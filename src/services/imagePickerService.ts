import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface ImagePickerResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export class ImagePickerService {
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
      }
      return true;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  }

  static async pickFromGallery(): Promise<ImagePickerResult> {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        return {
          success: false,
          error: 'Permission to access media library is required'
        };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Image selection was cancelled'
        };
      }

      return {
        success: true,
        uri: result.assets[0].uri
      };
    } catch (error) {
      console.error('Failed to pick image from gallery:', error);
      return {
        success: false,
        error: 'Failed to pick image from gallery'
      };
    }
  }

  static async takePhoto(): Promise<ImagePickerResult> {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        return {
          success: false,
          error: 'Camera permission is required'
        };
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Photo capture was cancelled'
        };
      }

      return {
        success: true,
        uri: result.assets[0].uri
      };
    } catch (error) {
      console.error('Failed to take photo:', error);
      return {
        success: false,
        error: 'Failed to take photo'
      };
    }
  }

  static showImagePickerOptions(
    onGallery: () => void,
    onCamera: () => void,
    onCancel?: () => void
  ) {
    Alert.alert(
      'Select Image',
      'Choose how you want to select an image',
      [
        {
          text: 'Camera',
          onPress: onCamera,
        },
        {
          text: 'Gallery',
          onPress: onGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel,
        },
      ],
      { cancelable: true }
    );
  }
}