import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { styles } from '../../styles/history_styles';

// Define types for our ride data
interface Driver {
  name: string;
  vehicle: string;
  plate: string;
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
}

// Mock data for ride history
const mockRides: Ride[] = [
  {
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
    },
    rating: 5,
  },
  {
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
    },
    rating: 4,
  },
  {
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
    },
    rating: 5,
  },
];

export default function HistoryScreen() {
  const renderRideItem = ({ item }: { item: Ride }) => (
    <Animated.View
      style={[styles.rideCard]}
      entering={FadeIn.delay(200)}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => router.push('/ride-details' as any)}
        activeOpacity={0.7}
      >
        <View style={styles.rideHeader}>
          <View style={styles.dateTimeContainer}>
            <FontAwesome5 name="calendar-alt" size={16} color="#007AFF" style={styles.headerIcon} />
            <View>
              <Text style={styles.rideDate}>{item.date}</Text>
              <Text style={styles.rideTime}>{item.time}</Text>
            </View>
          </View>
          <View style={styles.rideStatus}>
            <FontAwesome5 name="check-circle" size={16} color="#34C759" />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationItem}>
            <View style={styles.locationIconContainer}>
              <FontAwesome5 name="dot-circle" size={16} color="#007AFF" />
              <View style={styles.locationLine} />
            </View>
            <Text style={styles.locationText}>{item.pickup}</Text>
          </View>
          <View style={styles.locationItem}>
            <View style={styles.locationIconContainer}>
              <FontAwesome5 name="map-marker-alt" size={16} color="#FF3B30" />
            </View>
            <Text style={styles.locationText}>{item.dropoff}</Text>
          </View>
        </View>

        <View style={styles.rideFooter}>
          <View style={styles.driverInfo}>
            <FontAwesome5 name="user-circle" size={24} color="#666" style={styles.driverIcon} />
            <View>
              <Text style={styles.driverName}>{item.driver.name}</Text>
              <Text style={styles.vehicleInfo}>
                <FontAwesome5 name="car" size={12} color="#666" /> {item.driver.vehicle}
              </Text>
            </View>
          </View>
          <View style={styles.rideDetails}>
            <Text style={styles.fareText}>{item.fare}</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <FontAwesome5
                  key={index}
                  name="star"
                  size={12}
                  solid={index < item.rating}
                  color={index < item.rating ? "#FFD700" : "#D1D1D6"}
                  style={styles.starIcon}
                />
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockRides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}