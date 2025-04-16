import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

type User = {
  name: string;
  email: string;
  phone: string;
  photo?: string;
};

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [photo, setPhoto] = useState(user?.photo);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement user update logic
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.photoContainer}
        entering={FadeIn.delay(100)}
      >
        <TouchableOpacity 
          style={styles.photoButton}
          onPress={handlePickImage}
          activeOpacity={0.8}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <LinearGradient
              colors={['#007AFF', '#00C6FF'] as const}
              style={styles.photoPlaceholder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="user" size={40} color="#fff" />
            </LinearGradient>
          )}
          <View style={styles.editIconContainer}>
            <LinearGradient
              colors={['#34C759', '#00B894'] as const}
              style={styles.editIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="camera" size={14} color="#fff" />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={styles.form}
        entering={FadeInDown.delay(200)}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="user" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="envelope" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="phone" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300)}
        style={styles.buttonContainer}
      >
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveButton}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  photoButton: {
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editIconGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
    paddingVertical: 0,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
}); 