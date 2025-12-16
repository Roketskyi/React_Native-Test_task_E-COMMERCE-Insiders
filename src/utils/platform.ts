import { Platform } from 'react-native';

export const createShadow = (
  elevation: number,
  shadowColor: string = '#000',
  shadowOpacity: number = 0.1
) => {
  if (Platform.OS === 'web') {
    const blur = elevation * 2;
    const offset = Math.ceil(elevation * 0.5);
    
    return {
      boxShadow: `0 ${offset}px ${blur}px rgba(0, 0, 0, ${shadowOpacity})`,
    };
  }
  
  return {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: Math.ceil(elevation * 0.5),
    },
    shadowOpacity,
    shadowRadius: elevation,
    elevation,
  };
};

export const createPointerEvents = (value: 'auto' | 'none' | 'box-none' | 'box-only') => {
  if (Platform.OS === 'web') {
    return {
      pointerEvents: value as any,
    };
  }
  
  return {
    pointerEvents: value,
  };
};