import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from './CartItem';
import { Typography } from './ui';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { CartItemType } from '../types';

interface SwipeableCartItemProps {
  item: CartItemType;
  onDelete: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
}


const DELETE_BUTTON_WIDTH = 80;
const SWIPE_THRESHOLD = DELETE_BUTTON_WIDTH * 0.5;
const DELETE_THRESHOLD = DELETE_BUTTON_WIDTH * 0.8;

export const SwipeableCartItem: React.FC<SwipeableCartItemProps> = ({
  item,
  onDelete,
  onQuantityChange,
}) => {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;
  const deleteScale = useRef(new Animated.Value(0.8)).current;
  const itemOpacity = useRef(new Animated.Value(1)).current;
  const itemScale = useRef(new Animated.Value(1)).current;
  const [itemHeight, setItemHeight] = useState(0);
  const lastOffset = useRef(0);

  React.useEffect(() => {
    lastOffset.current = 0;
    translateX.setValue(0);
    deleteOpacity.setValue(0);
    deleteScale.setValue(0.8);
    itemOpacity.setValue(1);
    itemScale.setValue(1);
  }, [item.id]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      
      onPanResponderGrant: () => {
        // Don't use setOffset, work with absolute values
      },
      
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx <= 0) {
          const newPosition = lastOffset.current + gestureState.dx;
          const limitedPosition = Math.max(newPosition, -DELETE_BUTTON_WIDTH);
          
          if (__DEV__ && Math.abs(limitedPosition) > DELETE_BUTTON_WIDTH) {
            console.warn('Position exceeded limit:', limitedPosition, 'Max:', -DELETE_BUTTON_WIDTH);
          }
          
          translateX.setValue(limitedPosition);
          
          const progress = Math.abs(limitedPosition) / DELETE_BUTTON_WIDTH;
          deleteOpacity.setValue(progress);
          deleteScale.setValue(0.8 + (0.2 * progress));
        }
      },
      
      onPanResponderRelease: (_, gestureState) => {
        const newPosition = lastOffset.current + gestureState.dx;
        const limitedPosition = Math.max(newPosition, -DELETE_BUTTON_WIDTH);
        
        if (Math.abs(limitedPosition) >= DELETE_THRESHOLD) {
          handleDelete();
        } else if (Math.abs(limitedPosition) >= SWIPE_THRESHOLD) {
          animateToPosition(-DELETE_BUTTON_WIDTH);
        } else {
          animateToPosition(0);
        }
      },
    })
  ).current;

  const animateToPosition = (toValue: number) => {
    const clampedValue = Math.max(Math.min(toValue, 0), -DELETE_BUTTON_WIDTH);
    lastOffset.current = clampedValue;
    
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: clampedValue,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(deleteOpacity, {
        toValue: clampedValue < 0 ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(deleteScale, {
        toValue: clampedValue < 0 ? 1 : 0.8,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const handleDelete = () => {
    Alert.alert(
      'Remove Item',
      `Remove "${item.title}" from your cart?`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel', 
          onPress: () => animateToPosition(0) 
        },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            Animated.parallel([
              Animated.timing(itemOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(itemScale, {
                toValue: 0.8,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(deleteOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
              }),
            ]).start(() => {
              onDelete(item.id);
            });
          }
        }
      ]
    );
  };

  const handleDeleteButtonPress = () => {
    Animated.sequence([
      Animated.timing(deleteScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(deleteScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
    
    handleDelete();
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.deleteBackground, 
          { 
            backgroundColor: colors.error,
            height: itemHeight,
            opacity: deleteOpacity,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.deleteAction,
            {
              transform: [{ scale: deleteScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteButtonPress}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Typography variant="caption" color="inverse" weight="medium" style={styles.deleteText}>
              Remove
            </Typography>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Swipeable Cart Item */}
      <Animated.View
        style={[
          styles.itemContainer,
          {
            transform: [{ translateX }, { scale: itemScale }],
            opacity: itemOpacity,
          },
        ]}
        {...panResponder.panHandlers}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setItemHeight(height);
        }}
      >
        <CartItem
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onDelete}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    position: 'relative',
  },

  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: DELETE_BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
  },

  deleteAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.sm,
  },

  deleteText: {
    marginTop: SPACING.xs,
    fontSize: 11,
  },

  itemContainer: {
    // No additional styling - let CartItem handle its own appearance
  },
});