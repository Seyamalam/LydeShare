import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// Define types for our ride data
interface Driver {
  name: string;
  vehicle: string;
  plate: string;
  photo?: string;
  rating: number;
  phone: string;
}

interface Ride {
  id: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  fare: string;
  status: string;
  driver: Driver;
  rating: number;
  distance: string;
  duration: string;
  paymentMethod: string;
}

// Mock data for ride details
const mockRideDetails: Record<string, Ride> = {
  '1': {
    id: '1',
    date: '2023-04-15',
    time: '09:30 AM',
    pickup: 'Gulshan, Dhaka',
    dropoff: 'Banani, Dhaka',
    fare: '৳250',
    status: 'completed',
    driver: {
      name: 'Karim',
      vehicle: 'Toyota Axio',
      plate: 'DHAKA METRO GA 1234',
      rating: 4.8,
      phone: '+880 1711-123456',
    },
    rating: 5,
    distance: '3.2 km',
    duration: '12 mins',
    paymentMethod: 'Cash',
  },
  '2': {
    id: '2',
    date: '2023-04-10',
    time: '02:15 PM',
    pickup: 'Dhanmondi, Dhaka',
    dropoff: 'Mohakhali, Dhaka',
    fare: '৳180',
    status: 'completed',
    driver: {
      name: 'Rahim',
      vehicle: 'Honda City',
      plate: 'DHAKA METRO GA 5678',
      rating: 4.5,
      phone: '+880 1711-234567',
    },
    rating: 4,
    distance: '2.8 km',
    duration: '10 mins',
    paymentMethod: 'bKash',
  },
  '3': {
    id: '3',
    date: '2023-04-05',
    time: '11:45 AM',
    pickup: 'Uttara, Dhaka',
    dropoff: 'Mirpur, Dhaka',
    fare: '৳220',
    status: 'completed',
    driver: {
      name: 'Jamal',
      vehicle: 'Toyota Premio',
      plate: 'DHAKA METRO GA 9012',
      rating: 4.9,
      phone: '+880 1711-345678',
    },
    rating: 5,
    distance: '4.5 km',
    duration: '15 mins',
    paymentMethod: 'Card',
  },
};

function RideDetailsScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const ride = mockRideDetails[rideId];

  if (!ride) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={50} color="#ccc" />
          <Text style={styles.errorText}>Ride not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Ride Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.rideCard}>
          <View style={styles.rideHeader}>
            <View>
              <Text style={styles.rideDate}>{ride.date}</Text>
              <Text style={styles.rideTime}>{ride.time}</Text>
            </View>
            <View style={styles.rideStatus}>
              <FontAwesome name="check-circle" size={16} color="#34C759" />
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <FontAwesome name="map-marker" size={16} color="#007AFF" />
              <Text style={styles.locationText}>{ride.pickup}</Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationItem}>
              <FontAwesome name="flag" size={16} color="#007AFF" />
              <Text style={styles.locationText}>{ride.dropoff}</Text>
            </View>
          </View>

          <View style={styles.rideInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{ride.distance}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{ride.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Payment</Text>
              <Text style={styles.infoValue}>{ride.paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.fareContainer}>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareAmount}>{ride.fare}</Text>
          </View>
        </View>

        <View style={styles.driverCard}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          
          <View style={styles.driverInfo}>
            <View style={styles.driverPhoto}>
              {ride.driver.photo ? (
                <FontAwesome name="user-circle" size={50} color="#007AFF" />
              ) : (
                <FontAwesome name="user-circle" size={50} color="#007AFF" />
              )}
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{ride.driver.name}</Text>
              <Text style={styles.vehicleInfo}>
                {ride.driver.vehicle} • {ride.driver.plate}
              </Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{ride.driver.rating}</Text>
              </View>
            </View>
          </View>

          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="phone" size={20} color="#007AFF" />
              <Text style={styles.actionText}>Call Driver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="comment" size={20} color="#007AFF" />
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.sectionTitle}>Your Rating</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= ride.rating ? 'star' : 'star-o'}
                size={24}
                color={star <= ride.rating ? '#FFD700' : '#ccc'}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rideTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rideStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#34C759',
    marginLeft: 5,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  locationDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
    marginLeft: 26,
  },
  rideInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fareAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  driverCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverPhoto: {
    marginRight: 15,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
});

export default RideDetailsScreen; 