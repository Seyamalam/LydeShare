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
  primary: '#6366F1', // Indigo
  secondary: '#818CF8', // Lighter indigo
  background: '#F8FAFC', // Light slate
  surface: '#FFFFFF',
  text: '#1E293B', // Slate-800
  inactive: '#94A3B8' // Slate-400
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
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      overflow: 'hidden',
    }}>
      <Animated.View
        style={[{
          position: 'absolute',
          top: 0,
          left: 0,
          width: TAB_WIDTH,
          height: 65,
          borderRadius: 32,
          backgroundColor: COLORS.primary + '10',
        }, indicatorStyle]}
      />
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
              color: isFocused ? COLORS.primary : COLORS.inactive,
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
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