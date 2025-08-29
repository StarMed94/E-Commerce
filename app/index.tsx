import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

export default function IndexScreen() {
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      // Redirect to tabs after checking auth state
      router.replace('/(tabs)');
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>جاري التحميل...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
