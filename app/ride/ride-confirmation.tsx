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
      {/* Main status */}
      <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 12 }}>
        <View style={{
          backgroundColor: '#E8F3FF',
          borderRadius: 20,
          paddingVertical: 12,
          paddingHorizontal: 28,
          marginBottom: 18,
        }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#2563eb', textAlign: 'center' }}>Ride Confirmed</Text>
          <Text style={{ fontSize: 15, color: '#666', marginTop: 4, textAlign: 'center' }}>Your driver is on the way</Text>
        </View>
      </View>

      {currentLocation && driverLocation && (
        <View style={[styles.mapContainer, { borderRadius: 20, marginTop: 0, marginBottom: 18, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }]}> 
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[styles.map, { borderRadius: 20 }]}
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

      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Text style={{ fontSize: 15, color: '#666' }}>Driver arriving in</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2563eb', marginTop: 2 }}>{estimatedArrival} minutes</Text>
      </View>

      {/* Driver Card */}
      <View style={{
        marginHorizontal: 20,
        marginBottom: 18,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: driver.photo }} style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#222' }}>{driver.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={{ marginLeft: 6, fontSize: 16, color: '#666', fontWeight: '600' }}>{driver.rating}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 }}>
          <Text style={{ fontSize: 16, color: '#333' }}>{driver.carModel} • {driver.carColor}</Text>
          <Text style={{ fontSize: 14, color: '#2563eb', marginTop: 2, fontWeight: '700', letterSpacing: 1 }}>{driver.licensePlate}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleContactDriver}>
            <FontAwesome name="phone" size={22} color="#2563eb" />
            <Text style={{ marginTop: 5, fontSize: 14, color: '#2563eb', fontWeight: '600' }}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleContactDriver}>
            <FontAwesome name="comment" size={22} color="#2563eb" />
            <Text style={{ marginTop: 5, fontSize: 14, color: '#2563eb', fontWeight: '600' }}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ride Details Card */}
      <View style={{
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 15 }}>Ride Details</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <FontAwesome name="map-marker" size={20} color="#2563eb" />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Pickup</Text>
            <Text style={{ fontSize: 16, color: '#222', fontWeight: '600', marginTop: 2 }}>{rideDetails.pickup}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <FontAwesome name="flag" size={20} color="#2563eb" />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Drop-off</Text>
            <Text style={{ fontSize: 16, color: '#222', fontWeight: '600', marginTop: 2 }}>{rideDetails.dropoff}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <FontAwesome name="car" size={20} color="#2563eb" />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Ride Type</Text>
            <Text style={{ fontSize: 16, color: '#222', fontWeight: '600', marginTop: 2 }}>{rideDetails.rideType}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <FontAwesome name="money" size={20} color="#2563eb" />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Fare</Text>
            <Text style={{ fontSize: 16, color: '#222', fontWeight: '600', marginTop: 2 }}>{rideDetails.fare}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
          <FontAwesome name="credit-card" size={20} color="#2563eb" />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Payment</Text>
            <Text style={{ fontSize: 16, color: '#222', fontWeight: '600', marginTop: 2 }}>{rideDetails.paymentMethod}</Text>
          </View>
        </View>
      </View>

      <Button
        title="Cancel Ride"
        onPress={handleCancelRide}
        loading={isLoading}
        variant="outline"
        style={{ marginHorizontal: 20, marginBottom: 40, borderRadius: 20, borderColor: '#2563eb' }}
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