import React, { useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { createShadow } from '../utils/platform';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
}

const SearchBar = React.memo<SearchBarProps>(({
  value,
  onChangeText,
  placeholder = "Search products...",
  autoFocus = false,
  onFocus,
  onBlur,
  onSubmit,
  loading = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const focusAnimation = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  }, [focusAnimation, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  }, [focusAnimation, onBlur]);

  const handleClear = useCallback(() => {
    onChangeText('');
    inputRef.current?.focus();
  }, [onChangeText]);

  const handleSubmit = useCallback(() => {
    inputRef.current?.blur();
    onSubmit?.();
  }, [onSubmit]);

  const borderColor = focusAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.neutral[200], COLORS.primary[600]],
  });

  const shadowOpacity = focusAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.15],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            borderColor,
            shadowOpacity: Platform.OS === 'ios' ? shadowOpacity : 0.1,
          },
        ]}
      >
        <View style={styles.searchIconContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          placeholderTextColor={COLORS.text.tertiary}
          returnKeyType="search"
          clearButtonMode="never" // We'll handle this manually
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
          editable={!loading}
        />

        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingIndicator}>⏳</Text>
          </View>
        )}
      </Animated.View>

      {isFocused && value.length > 0 && (
        <View style={styles.searchHint}>
          <Text style={styles.searchHintText}>
            Press search to find "{value}"
          </Text>
        </View>
      )}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';

export { SearchBar };

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background.primary,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 2,
    ...createShadow(1, '#000', 0.05),
  },
  
  searchIconContainer: {
    marginRight: SPACING.sm,
  },
  
  searchIcon: {
    fontSize: 16,
    color: COLORS.text.tertiary,
  },
  
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.primary,
    paddingVertical: 0,
  },
  
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.neutral[200],
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  clearButtonText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: 'bold',
  },
  
  loadingContainer: {
    marginLeft: SPACING.xs,
  },
  
  loadingIndicator: {
    fontSize: 16,
  },
  
  searchHint: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  
  searchHintText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.tertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontStyle: 'italic',
  },
});