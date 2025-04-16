import { Stack } from 'expo-router';

export default function RideLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="ride-details"
        options={{
          title: 'Ride Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="live-ride"
        options={{
          title: 'Live Ride',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="trip-summary"
        options={{
          title: 'Trip Summary',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ride-confirmation"
        options={{
          title: 'Ride Confirmation',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 