import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from './components/Button';

// Mock data for onboarding slides
const onboardingSlides = [
  {
    id: '1',
    title: 'Welcome to Ryde',
    description: 'Your trusted ride-sharing app in Bangladesh',
    image: require('../assets/onboarding-1.png'), // You'll need to add these images
  },
  {
    id: '2',
    title: 'Quick & Easy Booking',
    description: 'Book a ride in seconds with our simple interface',
    image: require('../assets/onboarding-2.png'),
  },
  {
    id: '3',
    title: 'Multiple Ride Options',
    description: 'Choose from Car, Bike, or CNG based on your needs',
    image: require('../assets/onboarding-3.png'),
  },
  {
    id: '4',
    title: 'Safe & Reliable',
    description: 'All our drivers are verified for your safety',
    image: require('../assets/onboarding-4.png'),
  },
];

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: typeof onboardingSlides[0] }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Navigate to welcome screen
      router.replace('/welcome');
    }
  };

  const handleSkip = () => {
    // Navigate to welcome screen
    router.replace('/welcome');
  };

  const handleGetStarted = () => {
    // Navigate to auth flow
    router.replace('/(auth)/login');
  };

  const renderDotIndicators = () => {
    return (
      <View style={styles.dotContainer}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? '#007AFF' : '#D1D1D6' },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        {renderDotIndicators()}
        
        <View style={styles.buttonContainer}>
          {currentIndex < onboardingSlides.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <Button
                title="Next"
                onPress={handleNext}
                style={styles.nextButton}
              />
            </>
          ) : (
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#007AFF',
    fontSize: 16,
  },
  nextButton: {
    width: '70%',
  },
  getStartedButton: {
    width: '100%',
  },
}); 