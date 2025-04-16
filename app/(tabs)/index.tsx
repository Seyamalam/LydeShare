import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, useWindowDimensions, Image } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from '../../styles/tabs_index_styles';

type RecentRide = {
  id: string;
  date: string;
  from: string;
  to: string;
  price: number;
  status: 'completed' | 'cancelled';
};

type Promotion = {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
  backgroundColor: [string, string];
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { height: windowHeight } = useWindowDimensions();

  const recentRides: RecentRide[] = [
    {
      id: '1',
      date: '2 hours ago',
      from: 'Home',
      to: 'Office',
      price: 250,
      status: 'completed'
    },
    {
      id: '2',
      date: 'Yesterday',
      from: 'Mall',
      to: 'Home',
      price: 180,
      status: 'completed'
    }
  ];

  const promotions: Promotion[] = [
    {
      id: '1',
      title: 'Morning Discount',
      description: 'Get 20% off on rides before 10 AM',
      code: 'MORNING20',
      discount: '20%',
      validUntil: 'Valid until June 30',
      backgroundColor: ['#4CAF50', '#2E7D32']
    },
    {
      id: '2',
      title: 'Weekend Special',
      description: '15% off on weekend rides',
      code: 'WEEKEND15',
      discount: '15%',
      validUntil: 'Valid until June 30',
      backgroundColor: ['#2196F3', '#1565C0']
    }
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const renderRecentRide = (ride: RecentRide) => (
    <TouchableOpacity 
      key={ride.id}
      style={styles.rideCard}
      onPress={() => router.push({
        pathname: '/ride/ride-details',
        params: { id: ride.id }
      })}
    >
      <View style={styles.rideIconContainer}>
        <FontAwesome5 name="route" size={20} color="#007AFF" />
      </View>
      <View style={styles.rideDetails}>
        <View style={styles.rideRow}>
          <Text style={styles.rideTitle}>{ride.from} → {ride.to}</Text>
          <Text style={styles.ridePrice}>৳{ride.price}</Text>
        </View>
        <View style={styles.rideRow}>
          <Text style={styles.rideDate}>{ride.date}</Text>
          <View style={[styles.rideStatus, 
            { backgroundColor: ride.status === 'completed' ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={[styles.rideStatusText, 
              { color: ride.status === 'completed' ? '#2E7D32' : '#C62828' }]}>
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPromotion = (promo: Promotion) => (
    <TouchableOpacity key={promo.id} style={styles.promoCard}>
      <LinearGradient
        colors={promo.backgroundColor as readonly [string, string]}
        style={styles.promoGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.promoContent}>
          <View>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDescription}>{promo.description}</Text>
            <View style={styles.promoCodeContainer}>
              <Text style={styles.promoCode}>{promo.code}</Text>
            </View>
          </View>
          <Text style={styles.promoValidity}>{promo.validUntil}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {user?.name}</Text>
            <Text style={styles.subtitle}>Where would you like to go?</Text>
          </View>

          <View style={[styles.mapContainer, { height: windowHeight * 0.3 }]}>
            {location ? (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation
                showsMyLocationButton
              >
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="You are here"
                />
              </MapView>
            ) : (
              <View style={styles.mapPlaceholder}>
                <Text>Loading map...</Text>
              </View>
            )}
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/book')}
            >
              <View style={styles.actionIcon}>
                <FontAwesome5 name="car" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Book a Ride</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/history')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#34B27B' }]}>
                <FontAwesome5 name="history" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Ride History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/profile/saved-addresses')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#2E86DE' }]}>
                <FontAwesome5 name="map-marker" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Saved Places</Text>
            </TouchableOpacity>
          </View>

          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Rides</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                <Text style={styles.sectionLink}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentRides.map(renderRecentRide)}
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Summary</Text>
              <TouchableOpacity onPress={() => router.push('/profile/payment-methods')}>
                <Text style={styles.sectionLink}>Manage</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentCard}>
              <View style={styles.paymentMethod}>
                <View style={styles.paymentIcon}>
                  <FontAwesome5 name="wallet" size={20} color="#007AFF" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>Wallet Balance</Text>
                  <Text style={styles.paymentAmount}>৳1,250</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addMoneyButton}>
                <Text style={styles.addMoneyText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Promotions</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.promoScroll}
            >
              {promotions.map(renderPromotion)}
            </ScrollView>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(500)}
            style={[styles.section, styles.newsSection]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Updates</Text>
            </View>
            <View style={styles.newsCard}>
              <Image 
                source={{ uri: 'https://picsum.photos/200/100' }} 
                style={styles.newsImage} 
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>New Safety Features</Text>
                <Text style={styles.newsDescription}>
                  We've added new safety features to make your rides even more secure.
                </Text>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Read More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
