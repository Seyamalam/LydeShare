import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type SupportItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  gradient: readonly [string, string];
};

export default function SupportScreen() {
  const supportItems: SupportItem[] = [
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Find answers to common questions',
      icon: 'question-circle',
      gradient: ['#007AFF', '#00C6FF'] as const,
      action: () => {}
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: 'comments',
      gradient: ['#34C759', '#00B894'] as const,
      action: () => {}
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email',
      icon: 'envelope',
      gradient: ['#FF9500', '#FFCC00'] as const,
      action: () => Linking.openURL('mailto:support@ryde.com')
    },
    {
      id: 'phone',
      title: 'Call Us',
      description: 'Available 24/7',
      icon: 'phone-alt',
      gradient: ['#AF52DE', '#FF66FF'] as const,
      action: () => Linking.openURL('tel:+1234567890')
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      description: 'Help us improve our service',
      icon: 'comment-alt',
      gradient: ['#8E8E93', '#AEAEB2'] as const,
      action: () => {}
    }
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>How can we help?</Text>
        <Text style={styles.headerSubtitle}>
          Choose an option below to get assistance
        </Text>
      </Animated.View>

      {supportItems.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInDown.delay(200 + index * 100)}
        >
          <TouchableOpacity
            style={styles.supportCard}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={item.gradient}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name={item.icon} size={20} color="#fff" />
            </LinearGradient>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#8e8e93" />
          </TouchableOpacity>
        </Animated.View>
      ))}

      <Animated.View
        entering={FadeInDown.delay(800)}
        style={styles.emergencyContainer}
      >
        <Text style={styles.emergencyTitle}>Emergency?</Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => Linking.openURL('tel:911')}
        >
          <LinearGradient
            colors={['#FF3B30', '#FF6B6B'] as const}
            style={styles.emergencyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="phone" size={20} color="#fff" style={styles.emergencyIcon} />
            <Text style={styles.emergencyText}>Call Emergency Services</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1c1c1e',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
  },
  supportCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1c1c1e',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#8e8e93',
  },
  emergencyContainer: {
    marginTop: 24,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1c1c1e',
    marginBottom: 12,
  },
  emergencyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 16,
  },
  emergencyIcon: {
    marginRight: 8,
  },
  emergencyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
}); 