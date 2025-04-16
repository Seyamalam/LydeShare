import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function RideConfirmationScreen() {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [driverLocation, setDriverLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<number>(5); // in minutes
  const [isLoading, setIsLoading] = useState(false);

  // Mock driver data
  const driver = {
    name: 'John Smith',
    rating: 4.8,
    carModel: 'Toyota Camry',
    carColor: 'White',
    licensePlate: 'ABC 123',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  };

  // Mock ride details
  const rideDetails = {
    pickup: 'Current Location',
    dropoff: 'Destination',
    rideType: 'Car',
    fare: '৳200-300',
    paymentMethod: 'Cash',
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to track your ride.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Simulate driver location (slightly offset from user location)
      if (location) {
        setDriverLocation({
          latitude: location.coords.latitude + 0.005,
          longitude: location.coords.longitude + 0.005,
        });
      }
    })();
  }, []);

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            // Simulate cancellation process
            setTimeout(() => {
              setIsLoading(false);
              router.replace('/(tabs)');
            }, 1000);
          },
        },
      ],
    );
  };

  const handleContactDriver = () => {
    // In a real app, this would open the phone dialer or messaging app
    Alert.alert('Contact Driver', 'This would open the phone dialer or messaging app in a real app.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride Confirmed</Text>
        <Text style={styles.subtitle}>Your driver is on the way</Text>
      </View>

      {currentLocation && driverLocation && (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
          >
            <Marker
              coordinate={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
              }}
              title="Driver Location"
            >
              <View style={styles.driverMarker}>
                <FontAwesome name="car" size={20} color="#007AFF" />
              </View>
            </Marker>
          </MapView>
        </View>
      )}

      <View style={styles.arrivalInfo}>
        <Text style={styles.arrivalText}>Driver arriving in</Text>
        <Text style={styles.arrivalTime}>{estimatedArrival} minutes</Text>
      </View>

      <View style={styles.driverCard}>
        <View style={styles.driverHeader}>
          <Image source={{ uri: driver.photo }} style={styles.driverPhoto} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{driver.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.carInfo}>
          <Text style={styles.carText}>{driver.carModel} • {driver.carColor}</Text>
          <Text style={styles.licensePlate}>{driver.licensePlate}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleContactDriver}>
            <FontAwesome name="phone" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleContactDriver}>
            <FontAwesome name="comment" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rideDetailsCard}>
        <Text style={styles.rideDetailsTitle}>Ride Details</Text>
        
        <View style={styles.rideDetailItem}>
          <FontAwesome name="map-marker" size={20} color="#007AFF" />
          <View style={styles.rideDetailTextContainer}>
            <Text style={styles.rideDetailLabel}>Pickup</Text>
            <Text style={styles.rideDetailValue}>{rideDetails.pickup}</Text>
          </View>
        </View>
        
        <View style={styles.rideDetailItem}>
          <FontAwesome name="flag" size={20} color="#007AFF" />
          <View style={styles.rideDetailTextContainer}>
            <Text style={styles.rideDetailLabel}>Drop-off</Text>
            <Text style={styles.rideDetailValue}>{rideDetails.dropoff}</Text>
          </View>
        </View>
        
        <View style={styles.rideDetailItem}>
          <FontAwesome name="car" size={20} color="#007AFF" />
          <View style={styles.rideDetailTextContainer}>
            <Text style={styles.rideDetailLabel}>Ride Type</Text>
            <Text style={styles.rideDetailValue}>{rideDetails.rideType}</Text>
          </View>
        </View>
        
        <View style={styles.rideDetailItem}>
          <FontAwesome name="money" size={20} color="#007AFF" />
          <View style={styles.rideDetailTextContainer}>
            <Text style={styles.rideDetailLabel}>Fare</Text>
            <Text style={styles.rideDetailValue}>{rideDetails.fare}</Text>
          </View>
        </View>
        
        <View style={styles.rideDetailItem}>
          <FontAwesome name="credit-card" size={20} color="#007AFF" />
          <View style={styles.rideDetailTextContainer}>
            <Text style={styles.rideDetailLabel}>Payment</Text>
            <Text style={styles.rideDetailValue}>{rideDetails.paymentMethod}</Text>
          </View>
        </View>
      </View>

      <Button
        title="Cancel Ride"
        onPress={handleCancelRide}
        loading={isLoading}
        variant="outline"
        style={styles.cancelButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  mapContainer: {
    height: 250,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  arrivalInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  arrivalText: {
    fontSize: 16,
    color: '#666',
  },
  arrivalTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  driverCard: {
    margin: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverInfo: {
    marginLeft: 15,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
  },
  carInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  carText: {
    fontSize: 16,
    color: '#333',
  },
  licensePlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 14,
    color: '#007AFF',
  },
  rideDetailsCard: {
    margin: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  rideDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  rideDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideDetailTextContainer: {
    marginLeft: 15,
  },
  rideDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  rideDetailValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  cancelButton: {
    margin: 20,
    marginBottom: 40,
  },
}); 