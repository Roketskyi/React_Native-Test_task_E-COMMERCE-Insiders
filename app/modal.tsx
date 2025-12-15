import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { Typography, Button } from '../src/components/ui';
import { COLORS, SPACING } from '../src/constants/theme';
import { router } from 'expo-router';

export default function ModalScreen() {
  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Typography variant="h2" weight="bold" align="center" style={styles.title}>
        Demo Modal
      </Typography>
      
      <View style={styles.separator} />
      
      <Typography variant="body1" color="secondary" align="center" style={styles.description}>
        This is a demo modal screen. In a real app, this could be used for:
      </Typography>
      
      <View style={styles.listContainer}>
        <Typography variant="body2" color="secondary">• Product details</Typography>
        <Typography variant="body2" color="secondary">• Settings</Typography>
        <Typography variant="body2" color="secondary">• Filters</Typography>
        <Typography variant="body2" color="secondary">• User actions</Typography>
      </View>
      
      <Button
        title="Close Modal"
        onPress={handleClose}
        variant="primary"
        size="lg"
        style={styles.closeButton}
      />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background.primary,
  },

  title: {
    marginBottom: SPACING.lg,
  },

  separator: {
    marginVertical: SPACING.lg,
    height: 1,
    width: '80%',
    backgroundColor: COLORS.neutral[200],
  },

  description: {
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },

  listContainer: {
    alignSelf: 'stretch',
    marginBottom: SPACING['2xl'],
    paddingLeft: SPACING.lg,
  },
  
  closeButton: {
    minWidth: 200,
  },
});
