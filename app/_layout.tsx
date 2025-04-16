import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// This component handles the authenticated layout
function AuthenticatedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ride" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}

// Root layout wraps everything with necessary providers
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthenticatedLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
