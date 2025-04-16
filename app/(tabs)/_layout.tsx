import React from 'react';
import { View, Dimensions, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  useSharedValue,
  useAnimatedReaction
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;

// Modern color scheme
const COLORS = {
  primary: '#2563eb', // Blue-600
  secondary: '#60a5fa', // Blue-400
  background: '#F0F6FF', // Light blue
  surface: '#2563eb', // Blue-600 for dock background
  text: '#1E293B', // Slate-800
  inactive: '#bfdbfe' // Blue-200
};

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}

function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      mass: 0.5,
      damping: 8,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }, animatedStyle]}
    >
      <FontAwesome name={name} size={24} color={color} />
    </Animated.View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 15,
      stiffness: 120,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={{
      flexDirection: 'row',
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      height: 65,
      backgroundColor: COLORS.surface,
      borderRadius: 32,
      shadowColor: COLORS.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 16,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#3b82f6', // Blue-500 border for pop
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
            }}
          >
            {options.tabBarIcon?.({
              focused: isFocused,
              color: isFocused ? '#fff' : COLORS.inactive,
              size: 24,
            })}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="home" 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="car" 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="history" 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="user" 
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
} 