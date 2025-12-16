import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationResult {
  success: boolean;
  location?: Location.LocationObject;
  address?: string;
  error?: string;
}

export interface LocationPermissionResult {
  granted: boolean;
  canAskAgain: boolean;
  error?: string;
}

export class LocationService {
  static async requestPermissions(): Promise<LocationPermissionResult> {
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Failed to request location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        error: 'Failed to request location permissions'
      };
    }
  }

  static async getCurrentLocation(): Promise<LocationResult> {
    try {
      const permissionResult = await this.requestPermissions();
      
      if (!permissionResult.granted) {
        return {
          success: false,
          error: permissionResult.canAskAgain 
            ? 'Location permission is required to determine your delivery address'
            : 'Location permission was denied. Please enable it in settings.'
        };
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
      });

      return {
        success: true,
        location
      };
    } catch (error) {
      console.error('Failed to get current location:', error);
      return {
        success: false,
        error: 'Failed to get your current location. Please try again.'
      };
    }
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const parts = [
          address.streetNumber,
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country
        ].filter(Boolean);

        return parts.join(', ');
      }

      return null;
    } catch (error) {
      console.error('Failed to reverse geocode:', error);

      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }

  static async getLocationWithAddress(): Promise<LocationResult> {
    try {
      const locationResult = await this.getCurrentLocation();
      
      if (!locationResult.success || !locationResult.location) {
        return locationResult;
      }

      const { latitude, longitude } = locationResult.location.coords;
      
      let address: string;
      try {
        const geocodedAddress = await this.reverseGeocode(latitude, longitude);
        address = geocodedAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      } catch (geocodeError) {
        console.warn('Geocoding failed, using coordinates:', geocodeError);
        address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }

      return {
        success: true,
        location: locationResult.location,
        address
      };
    } catch (error) {
      console.error('Failed to get location with address:', error);
      return {
        success: false,
        error: 'Failed to get location information'
      };
    }
  }

  static async checkLocationServices(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('Failed to check location services:', error);
      return false;
    }
  }

  static formatCoordinates(latitude: number, longitude: number): string {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}