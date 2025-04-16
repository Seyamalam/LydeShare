import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type SettingItem = {
  id: string;
  title: string;
  icon: string;
  type: 'toggle' | 'button';
  value?: boolean;
  onPress?: () => void;
  gradient: readonly [string, string];
};

export default function SettingsScreen() {
  const [settings, setSettings] = React.useState<SettingItem[]>([
    {
      id: 'notifications',
      title: 'Push Notifications',
      icon: 'bell',
      type: 'toggle',
      value: true,
      gradient: ['#007AFF', '#00C6FF'] as const
    },
    {
      id: 'location',
      title: 'Location Services',
      icon: 'map-marker-alt',
      type: 'toggle',
      value: true,
      gradient: ['#34C759', '#00B894'] as const
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      icon: 'moon',
      type: 'toggle',
      value: false,
      gradient: ['#8E8E93', '#AEAEB2'] as const
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      icon: 'shield-alt',
      type: 'button',
      gradient: ['#FF9500', '#FFCC00'] as const
    },
    {
      id: 'about',
      title: 'About',
      icon: 'info-circle',
      type: 'button',
      gradient: ['#AF52DE', '#FF66FF'] as const
    }
  ]);

  const handleToggle = (id: string) => {
    setSettings(settings.map(item =>
      item.id === id ? { ...item, value: !item.value } : item
    ));
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {settings.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInDown.delay(100 * index)}
          style={styles.settingCard}
        >
          <View style={styles.settingLeft}>
            <LinearGradient
              colors={item.gradient}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name={item.icon} size={18} color="#fff" />
            </LinearGradient>
            <Text style={styles.settingTitle}>{item.title}</Text>
          </View>
          
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{ false: '#e4e4e4', true: '#007AFF' }}
              thumbColor="#fff"
            />
          ) : (
            <TouchableOpacity
              onPress={item.onPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome5 name="chevron-right" size={16} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  settingCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#1c1c1e',
  },
}); 