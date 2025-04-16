import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, Animated, Platform, ActivityIndicator, Easing, PanResponder, LayoutChangeEvent } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../../styles/book_styles';

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  type: 'cash' | 'mobile' | 'card';
};

const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', icon: 'money-bill', type: 'cash' },
  { id: 'bkash', name: 'bKash', icon: '../assets/bkash.png', type: 'mobile' },
  { id: 'nagad', name: 'Nagad', icon: '../assets/nagad.png', type: 'mobile' },
  { id: 'card', name: 'Credit/Debit Card', icon: '../assets/visa.png', type: 'card' },
];

export default function BookRideScreen() {
  const mapRef = useRef<MapView>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Location.LocationObject | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [selectedRideType, setSelectedRideType] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showRecentLocations, setShowRecentLocations] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');
  const [distance, setDistance] = useState<string | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const [swipeButtonText, setSwipeButtonText] = useState('Swipe to book ride');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const rideTypes = [
    { 
      id: 'car', 
      name: 'Car', 
      icon: 'car',
      basePrice: 200,
      pricePerKm: 15,
      capacity: '4 passengers',
      features: ['AC', 'Comfortable']
    },
    { 
      id: 'bike', 
      name: 'Bike', 
      icon: 'motorcycle',
      basePrice: 100,
      pricePerKm: 8,
      capacity: '1 passenger',
      features: ['Quick', 'Economic']
    },
    { 
      id: 'cng', 
      name: 'CNG', 
      icon: 'truck',
      basePrice: 150,
      pricePerKm: 12,
      capacity: '3 passengers',
      features: ['Economic', 'Open-air']
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      icon: 'car-side',
      basePrice: 300,
      pricePerKm: 20,
      capacity: '4 passengers',
      features: ['Luxury', 'Professional driver']
    },
  ];

  const recentLocations = [
    { id: '1', name: 'Home', address: '123 Home Street', icon: 'home' },
    { id: '2', name: 'Office', address: '456 Office Road', icon: 'building' },
    { id: '3', name: 'Gym', address: '789 Fitness Avenue', icon: 'dumbbell' },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to book a ride.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setCurrentLocation(location);
      setPickupCoords(location);
      
      if (location) {
        try {
          const address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (address[0]) {
            setPickup(`${address[0].street || ''} ${address[0].name || ''}`);
          }
          
          // Animate map to current location
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 1000);
          }
        } catch (error) {
          console.error('Error getting address:', error);
          setPickup('Current Location');
        }
      }
    })();
  }, []);

  const handleLocationSelect = async (text: string, isPickup: boolean) => {
    try {
      const results = await Location.geocodeAsync(text);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const locationObj = {
          coords: { latitude, longitude, altitude: null, accuracy: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        };
        
        if (isPickup) {
          setPickupCoords(locationObj);
        } else {
          setDropoffCoords(locationObj);
        }
        
        // Update map view to show both markers
        if (mapRef.current && pickupCoords && dropoffCoords) {
          mapRef.current.fitToCoordinates(
            [
              { latitude: pickupCoords.coords.latitude, longitude: pickupCoords.coords.longitude },
              { latitude: dropoffCoords.coords.latitude, longitude: dropoffCoords.coords.longitude }
            ],
            { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
          );
        }
        
        // Calculate distance and ETA
        if (pickupCoords && dropoffCoords) {
          // In a real app, you would use a routing service to get accurate distance and ETA
          const dist = calculateDistance(
            pickupCoords.coords.latitude,
            pickupCoords.coords.longitude,
            dropoffCoords.coords.latitude,
            dropoffCoords.coords.longitude
          );
          setDistance(`${dist.toFixed(1)} km`);
          setEta(`${Math.ceil(dist * 3)} mins`); // Rough estimate: 3 mins per km
        }
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setPickupCoords(location);
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (address[0]) {
        setPickup(`${address[0].street || ''} ${address[0].name || ''}`);
      }
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Could not get current location');
    }
  };

  const calculateFare = (type: typeof rideTypes[0]) => {
    if (!distance) return null;
    const dist = parseFloat(distance);
    const baseFare = type.basePrice;
    const distanceFare = dist * type.pricePerKm;
    return Math.ceil(baseFare + distanceFare);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleBookPress = () => {
    if (!pickup || !dropoff || !selectedRideType) return;
    animateButton();
    setShowPaymentModal(true);
  };

  const handleBookRide = () => {
    if (!pickup || !dropoff || !selectedRideType) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/ride/ride-confirmation');
    }, 1500);
  };

  const handleMapLocationSelect = async (coordinate: { latitude: number; longitude: number }) => {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
      
      if (address[0]) {
        const locationString = `${address[0].street || ''} ${address[0].name || ''}, ${address[0].city || ''}`;
        setTempLocation({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          address: locationString,
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const confirmLocationSelection = () => {
    if (tempLocation) {
      setDropoff(tempLocation.address);
      setDropoffCoords({
        coords: {
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
      setShowLocationModal(false);
      setTempLocation(null);
    }
  };

  const getFeatureColor = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'ac':
        return '#5856D6';
      case 'comfortable':
        return '#34C759';
      case 'quick':
        return '#FF9500';
      case 'economic':
        return '#30B0C7';
      case 'luxury':
        return '#AF52DE';
      case 'professional driver':
        return '#FF2D55';
      default:
        return '#8E8E93';
    }
  };

  // Add custom swipe button implementation
  function CustomSwipeButton({
    onSwipeSuccess,
    disabled,
    loading,
    text,
  }: {
    onSwipeSuccess: () => void;
    disabled: boolean;
    loading: boolean;
    text: string;
  }) {
    const dragX = useRef(new Animated.Value(0)).current;
    const [dragging, setDragging] = useState(false);
    const [width, setWidth] = useState(0);
    const thumbSize = 56;
    const railHeight = 64;
    const maxDrag = Math.max(0, width - thumbSize - 8);

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !loading,
      onMoveShouldSetPanResponder: () => !disabled && !loading,
      onPanResponderGrant: () => setDragging(true),
      onPanResponderMove: Animated.event([
        null,
        { dx: dragX },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        setDragging(false);
        const drag = Math.max(0, Math.min(gestureState.dx, maxDrag));
        if (drag > maxDrag * 0.7) {
          Animated.timing(dragX, {
            toValue: maxDrag,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            onSwipeSuccess();
            dragX.setValue(0);
          });
        } else {
          Animated.spring(dragX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        Animated.spring(dragX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    });

    function handleLayout(e: LayoutChangeEvent) {
      setWidth(e.nativeEvent.layout.width);
    }

    return (
      <View style={{ marginHorizontal: 16, marginBottom: 24, marginTop: 12 }} onLayout={handleLayout}>
        <View style={{
          height: railHeight,
          backgroundColor: disabled ? '#F2F2F7' : '#007AFF',
          borderRadius: 32,
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Text style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: disabled ? '#8E8E93' : '#fff',
            fontWeight: '600',
            fontSize: 18,
            zIndex: 1,
          }}>{loading ? 'Booking your ride...' : dragging ? 'Release to book...' : text}</Text>
          <Animated.View
            style={{
              position: 'absolute',
              left: 4,
              top: 4,
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ translateX: dragX.interpolate({
                inputRange: [0, maxDrag],
                outputRange: [0, maxDrag],
                extrapolate: 'clamp',
              }) }],
              shadowColor: '#007AFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
              zIndex: 2,
            }}
            {...panResponder.panHandlers}
          >
            {loading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <AntDesign name="arrowright" size={28} color={disabled ? '#8E8E93' : '#007AFF'} />
            )}
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.coords.latitude || 23.8103,
            longitude: currentLocation?.coords.longitude || 90.4125,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          {pickupCoords && (
            <Marker
              coordinate={{
                latitude: pickupCoords.coords.latitude,
                longitude: pickupCoords.coords.longitude,
              }}
              title="Pickup"
              pinColor="#007AFF"
            />
          )}
          {dropoffCoords && (
            <Marker
              coordinate={{
                latitude: dropoffCoords.coords.latitude,
                longitude: dropoffCoords.coords.longitude,
              }}
              title="Drop-off"
              pinColor="#FF3B30"
            />
          )}
        </MapView>
        
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={handleCurrentLocation}
        >
          <LinearGradient
            colors={['#007AFF', '#34C759']}
            style={styles.currentLocationGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="crosshairs" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.locationContainer}>
        <View style={[styles.locationInput, styles.pickupInput]}>
          <View style={[styles.locationIcon, styles.pickupIcon]}>
            <FontAwesome5 name="map-marker-alt" size={16} color="#fff" />
          </View>
          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>PICKUP</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {pickup || 'Current Location'}
            </Text>
          </View>
        </View>

        <View style={styles.locationDivider} />

        <View style={[styles.locationInput, styles.dropoffInput]}>
          <View style={[styles.locationIcon, styles.dropoffIcon]}>
            <FontAwesome5 name="flag" size={16} color="#fff" />
          </View>
          <TouchableOpacity 
            style={styles.dropoffButton}
            onPress={() => setShowLocationModal(true)}
          >
            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>DROP-OFF</Text>
              <Text 
                style={[styles.locationText, !dropoff && styles.placeholderText]} 
                numberOfLines={1}
              >
                {dropoff || 'Select drop-off location'}
              </Text>
            </View>
          </TouchableOpacity>
          {dropoff && (
            <TouchableOpacity onPress={() => setDropoff('')} style={styles.clearButton}>
              <FontAwesome5 name="times-circle" size={16} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showRecentLocations && (
        <View style={styles.recentLocations}>
          {recentLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.recentLocationItem}
              onPress={() => {
                setDropoff(location.address);
                handleLocationSelect(location.address, false);
                setShowRecentLocations(false);
              }}
            >
              <FontAwesome5 name={location.icon} size={16} color="#8E8E93" />
              <View style={styles.recentLocationText}>
                <Text style={styles.recentLocationName}>{location.name}</Text>
                <Text style={styles.recentLocationAddress}>{location.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.rideOptionsContainer}>
        <View style={styles.rideTypeHeader}>
          <Text style={styles.sectionTitle}>Select Ride Type</Text>
          {distance && <Text style={styles.distanceText}>{distance} • {eta}</Text>}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.rideTypesScroll}
        >
          {rideTypes.map((type) => (
            <TouchableOpacity 
              key={type.id} 
              style={[
                styles.rideTypeCard,
                selectedRideType === type.id && styles.selectedRideTypeCard
              ]}
              onPress={() => setSelectedRideType(type.id)}
            >
              <View style={[
                styles.rideTypeIconContainer,
                selectedRideType === type.id && styles.selectedRideTypeIcon
              ]}>
                <FontAwesome5 
                  name={type.icon} 
                  size={20} 
                  color={selectedRideType === type.id ? "#fff" : "#3A3A3C"} 
                />
              </View>
              
              <Text style={[
                styles.rideTypeName,
                selectedRideType === type.id && styles.selectedRideTypeText
              ]}>{type.name}</Text>
              
              <Text style={styles.rideTypePrice}>
                ৳{calculateFare(type) || `${type.basePrice}-${type.basePrice + 100}`}
              </Text>
              
              <Text style={styles.rideTypeCapacity}>
                <FontAwesome5 name="users" size={12} color="#3A3A3C" /> {type.capacity}
              </Text>
              
              <View style={styles.rideTypeFeatures}>
                {type.features.map((feature, index) => (
                  <View key={index} style={styles.rideTypeFeature}>
                    <View 
                      style={[
                        styles.featureDot,
                        { backgroundColor: getFeatureColor(feature) }
                      ]} 
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.additionalOptions}>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setShowScheduleModal(true)}
        >
          <FontAwesome5 name="clock" size={16} color="#007AFF" />
          <Text style={styles.optionButtonText}>Schedule Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => router.push('/profile/payment-methods')}
        >
          <FontAwesome5 name="credit-card" size={16} color="#007AFF" />
          <Text style={styles.optionButtonText}>Payment Method</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.promoContainer}>
        <TextInput
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          style={styles.promoInput}
        />
        <Button
          title="Apply"
          onPress={() => {/* Handle promo code */}}
          style={styles.promoButton}
          variant="outline"
        />
      </View>

      <TextInput
        placeholder="Notes to driver (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.notesInput}
      />

      <CustomSwipeButton
        onSwipeSuccess={handleBookRide}
        disabled={!dropoff || !selectedRideType}
        loading={isLoading}
        text={!dropoff ? 'Please enter drop-off location' : !selectedRideType ? 'Please select a ride type' : 'Swipe to book ride'}
      />

      {/* Schedule Modal */}
      <Modal
        visible={showScheduleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule Ride</Text>
            <DateTimePicker
              value={scheduledDate}
              mode="datetime"
              display="spinner"
              onChange={(event, date) => date && setScheduledDate(date)}
              minimumDate={new Date()}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowScheduleModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Confirm"
                onPress={() => {
                  // Handle scheduled ride
                  setShowScheduleModal(false);
                }}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            
            {paymentMethods.map((method: PaymentMethod) => (
              <TouchableOpacity 
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  selectedPaymentMethod === method.id && styles.selectedPaymentMethod
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <FontAwesome5 name={method.icon} size={24} color={selectedPaymentMethod === method.id ? "#007AFF" : "#333"} />
                <Text style={[
                  styles.paymentMethodName,
                  selectedPaymentMethod === method.id && styles.selectedPaymentMethodText
                ]}>{method.name}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => setShowPaymentModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button 
                title="Confirm" 
                onPress={() => {
                  // Handle booking with selected payment method
                  setShowPaymentModal(false);
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    router.push('/ride/ride-confirmation');
                  }, 1500);
                }}
                disabled={!selectedPaymentMethod}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowLocationModal(false)}
              style={styles.modalCloseButton}
            >
              <AntDesign name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Drop-off Location</Text>
            <TouchableOpacity 
              onPress={confirmLocationSelection}
              style={[
                styles.modalConfirmButton,
                !tempLocation && styles.modalConfirmButtonDisabled
              ]}
              disabled={!tempLocation}
            >
              <Text style={[
                styles.modalConfirmText,
                !tempLocation && styles.modalConfirmTextDisabled
              ]}>Confirm</Text>
            </TouchableOpacity>
          </View>
          
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.locationSelectionMap}
            initialRegion={{
              latitude: currentLocation?.coords.latitude || 23.8103,
              longitude: currentLocation?.coords.longitude || 90.4125,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => handleMapLocationSelect(e.nativeEvent.coordinate)}
          >
            {tempLocation && (
              <Marker
                coordinate={{
                  latitude: tempLocation.latitude,
                  longitude: tempLocation.longitude,
                }}
                pinColor="#FF3B30"
              />
            )}
          </MapView>
          
          {tempLocation && (
            <View style={styles.selectedLocationContainer}>
              <View style={styles.selectedLocationIcon}>
                <FontAwesome5 name="map-marker-alt" size={20} color="#FF3B30" />
              </View>
              <Text style={styles.selectedLocationText} numberOfLines={2}>
                {tempLocation.address}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
} 