import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: 'Payment Methods',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="saved-addresses"
        options={{
          title: 'Saved Addresses',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 