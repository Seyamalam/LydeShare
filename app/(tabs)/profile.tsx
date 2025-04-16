import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { styles } from '../../styles/profile_styles';

type MenuItem = {
  icon: string;
  title: string;
  onPress: () => void;
  color: string;
  gradient: readonly [string, string];
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const menuItems: MenuItem[] = [
    { 
      icon: 'user-edit', 
      title: 'Edit Profile', 
      onPress: () => router.push('/profile/edit-profile'),
      color: '#007AFF',
      gradient: ['#007AFF', '#00C6FF'] as const
    },
    { 
      icon: 'map-marker-alt', 
      title: 'Saved Addresses', 
      onPress: () => router.push('/profile/saved-addresses'),
      color: '#34C759',
      gradient: ['#34C759', '#00B894'] as const
    },
    { 
      icon: 'credit-card', 
      title: 'Payment Methods', 
      onPress: () => router.push('/profile/payment-methods'),
      color: '#FF9500',
      gradient: ['#FF9500', '#FFCC00'] as const
    },
    { 
      icon: 'headset', 
      title: 'Help & Support', 
      onPress: () => router.push('/profile/support'),
      color: '#AF52DE',
      gradient: ['#AF52DE', '#FF66FF'] as const
    },
    { 
      icon: 'cog', 
      title: 'Settings', 
      onPress: () => router.push('/profile/settings'),
      color: '#8E8E93',
      gradient: ['#8E8E93', '#AEAEB2'] as const
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeIn.delay(100)}
      >
        <View style={styles.profileImageContainer}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
          ) : (
            <LinearGradient
              colors={['#007AFF', '#00C6FF'] as const}
              style={styles.profileImagePlaceholder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="user" size={40} color="#fff" />
            </LinearGradient>
          )}
        </View>
        <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
        <Text style={styles.email}>{user?.email || 'test@example.com'}</Text>
        <Text style={styles.phone}>{user?.phone || '+1234567890'}</Text>
      </Animated.View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(200 + index * 100)}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <LinearGradient
                  colors={item.gradient}
                  style={styles.iconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name={item.icon} size={18} color="#fff" />
                </LinearGradient>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Animated.View
        entering={FadeInDown.delay(800)}
      >
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF3B30', '#FF6B6B'] as const}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="sign-out-alt" size={20} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}