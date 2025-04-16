import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { styles } from '../../styles/ride_trip_summary_styles';

// Mock data for trip details
const mockTripDetails = {
  id: 'trip-123',
  date: '2024-04-15',
  time: '14:30',
  pickup: '123 Main St, City',
  dropoff: '456 Park Ave, City',
  distance: '5.2 km',
  duration: '15 mins',
  fare: '৳250',
  paymentMethod: 'Cash',
  driver: {
    name: 'John Doe',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 4.8,
    vehicle: {
      model: 'Toyota Camry',
      color: 'White',
      plateNumber: 'ABC-123',
    },
  },
};

export default function TripSummaryScreen() {
  const params = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)'),
          },
        ],
      );
    }, 1500);
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(star)}
            style={styles.starButton}
          >
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={32}
              color={star <= rating ? '#FFD700' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Trip Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripDate}>
              {mockTripDetails.date} at {mockTripDetails.time}
            </Text>
            <Text style={styles.tripId}>Trip #{mockTripDetails.id}</Text>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.locationDot} />
            <View style={styles.routeLine} />
            <View style={[styles.locationDot, styles.dropoffDot]} />
          </View>

          <View style={styles.locationDetails}>
            <Text style={styles.locationText}>{mockTripDetails.pickup}</Text>
            <Text style={styles.locationText}>{mockTripDetails.dropoff}</Text>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <FontAwesome name="road" size={16} color="#666" />
              <Text style={styles.detailText}>{mockTripDetails.distance}</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="clock-o" size={16} color="#666" />
              <Text style={styles.detailText}>{mockTripDetails.duration}</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="money" size={16} color="#666" />
              <Text style={styles.detailText}>{mockTripDetails.fare}</Text>
            </View>
          </View>
        </View>

        <View style={styles.driverCard}>
          <Image
            source={{ uri: mockTripDetails.driver.photo }}
            style={styles.driverPhoto}
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{mockTripDetails.driver.name}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{mockTripDetails.driver.rating}</Text>
            </View>
            <Text style={styles.vehicleInfo}>
              {mockTripDetails.driver.vehicle.model} • {mockTripDetails.driver.vehicle.color}
            </Text>
            <Text style={styles.plateNumber}>{mockTripDetails.driver.vehicle.plateNumber}</Text>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Rate your trip</Text>
          <Text style={styles.ratingSubtitle}>How was your experience?</Text>
          {renderStars()}
          <TextInput
            style={styles.feedbackInput}
            placeholder="Add feedback (optional)"
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit Rating"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={rating === 0}
        />
      </View>
    </View>
  );
} 