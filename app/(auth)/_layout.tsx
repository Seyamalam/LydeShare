import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();

  // If user is already logged in, redirect to tabs
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Reset Password',
        }}
      />
    </Stack>
  );
} 