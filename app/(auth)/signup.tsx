import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signup, isLoading, error } = useAuth();

  const validateForm = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    await signup({ name, email, phone, password });
    if (!error) {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <TextInput
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Phone Number"
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={passwordError}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title="Sign Up"
        onPress={handleSignup}
        loading={isLoading}
        style={styles.button}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
}); 