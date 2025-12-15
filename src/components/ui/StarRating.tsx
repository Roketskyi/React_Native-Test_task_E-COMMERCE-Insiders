import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  size = 16, 
  showCount = false, 
  count = 0 
}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Text key={i} style={[styles.star, { fontSize: size }]}>
            ⭐
          </Text>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Text key={i} style={[styles.halfStar, { fontSize: size }]}>
            ⭐
          </Text>
        );
      } else {
        stars.push(
          <Text key={i} style={[styles.emptyStar, { fontSize: size }]}>
            ☆
          </Text>
        );
      }
    }
    
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {showCount && (
        <Text style={styles.countText}>
          ({count})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  star: {
    marginRight: 1,
  },
  
  halfStar: {
    marginRight: 1,
    opacity: 0.7,
  },
  
  emptyStar: {
    marginRight: 1,
    color: COLORS.neutral[300],
  },
  
  countText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
});