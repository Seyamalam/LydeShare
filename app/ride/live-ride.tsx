import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '../components/Button';

// Mock data for ride details
const mockRideDetails = {
  id: '12345',
  pickup: 'Gulshan, Dhaka',
  dropoff: 'Banani, Dhaka',
  fare: 250,
  estimatedTime: 15, // minutes
  driver: {
    id: 'D001',
    name: 'Karim Uddin',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    vehicle: {
      model: 'Toyota Axio',
      color: 'White',
      plate: 'DHAKA METRO GA 1234',
    },
    phone: '+880 1712345678',
  },
};

// Mock data for driver location updates
const mockLocationUpdates = [
  { lat: 23.7937, lng: 90.4066, timestamp: Date.now() - 60000 }, // 1 minute ago
  { lat: 23.7945, lng: 90.4075, timestamp: Date.now() - 30000 }, // 30 seconds ago
  { lat: 23.7952, lng: 90.4083, timestamp: Date.now() }, // current
];

export default function LiveRideScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const [rideDetails, setRideDetails] = useState(mockRideDetails);
  const [estimatedTime, setEstimatedTime] = useState(mockRideDetails.estimatedTime);
  const [currentLocation, setCurrentLocation] = useState(mockLocationUpdates[mockLocationUpdates.length - 1]);
  const [isCancelling, setIsCancelling] = useState(false);

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch the latest location from an API
      // For demo, we'll just update the estimated time
      setEstimatedTime(prev => Math.max(1, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCallDriver = () => {
    // In a real app, this would use a proper phone call API
    Linking.openURL(`tel:${rideDetails.driver.phone}`);
  };

  const handleMessageDriver = () => {
    // In a real app, this would open an in-app chat
    Alert.alert('Message Driver', 'This would open an in-app chat with the driver.');
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride? A cancellation fee may apply.',
      [
        { text: 'No, Continue Ride', style: 'cancel' },
        {
          text: 'Yes, Cancel Ride',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert('Ride Cancelled', 'Your ride has been cancelled.');
              router.replace('/(tabs)');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel ride. Please try again.');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Map View (Placeholder) */}
      <View style={styles.mapContainer}>
        <Image
          source={require('@/assets/map-placeholder.png')}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.mapOverlay}>
          <View style={styles.locationInfo}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>Your Location</Text>
          </View>
          <View style={styles.locationInfo}>
            <View style={[styles.locationDot, styles.driverDot]} />
            <Text style={styles.locationText}>Driver's Location</Text>
          </View>
        </View>
      </View>

      {/* Ride Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Driver is {estimatedTime} minutes away
        </Text>
        <Text style={styles.etaText}>
          Estimated arrival: {new Date(Date.now() + estimatedTime * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* Driver Info */}
      <View style={styles.driverContainer}>
        <Image
          source={{ uri: rideDetails.driver.photo }}
          style={styles.driverPhoto}
        />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{rideDetails.driver.name}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{rideDetails.driver.rating}</Text>
          </View>
          <Text style={styles.vehicleInfo}>
            {rideDetails.driver.vehicle.model} • {rideDetails.driver.vehicle.color}
          </Text>
          <Text style={styles.plateInfo}>{rideDetails.driver.vehicle.plate}</Text>
        </View>
      </View>

      {/* Ride Details */}
      <View style={styles.rideDetailsContainer}>
        <View style={styles.rideDetail}>
          <FontAwesome name="map-marker" size={20} color="#007AFF" />
          <View style={styles.rideDetailText}>
            <Text style={styles.rideDetailLabel}>Pickup</Text>
            <Text style={styles.rideDetailValue}>{rideDetails.pickup}</Text>
          </View>
        </View>
        <View style={styles.rideDetail}>
          <FontAwesome name="flag-checkered" size={20} color="#007AFF" />
          <View style={styles.rideDetailText}>
            <Text style={styles.rideDetailLabel}>Dropoff</Text>
            <Text style={styles.rideDetailValue}>{rideDetails.dropoff}</Text>
          </View>
        </View>
        <View style={styles.rideDetail}>
          <FontAwesome name="money" size={20} color="#007AFF" />
          <View style={styles.rideDetailText}>
            <Text style={styles.rideDetailLabel}>Fare</Text>
            <Text style={styles.rideDetailValue}>৳{rideDetails.fare}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCallDriver}>
          <FontAwesome name="phone" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleMessageDriver}>
          <FontAwesome name="comment" size={20} color="#007AFF" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleCancelRide}>
          <FontAwesome name="times-circle" size={20} color="#FF3B30" />
          <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  driverDot: {
    backgroundColor: '#34C759',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  etaText: {
    fontSize: 14,
    color: '#666',
  },
  driverContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  plateInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  rideDetailsContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rideDetail: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  rideDetailText: {
    marginLeft: 15,
    flex: 1,
  },
  rideDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  rideDetailValue: {
    fontSize: 16,
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 14,
    color: '#007AFF',
  },
  cancelText: {
    color: '#FF3B30',
  },
}); 