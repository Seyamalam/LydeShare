import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isLoading, error } = useAuth();

  const handleResetPassword = async () => {
    if (!email) return;
    
    await resetPassword(email);
    if (!error) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent password reset instructions to {email}
        </Text>
        <Text style={styles.instruction}>
          Please check your email and follow the instructions to reset your password.
        </Text>
        <Button
          title="Back to Login"
          onPress={() => router.replace('/login')}
          style={styles.button}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>

      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title="Send Reset Instructions"
        onPress={handleResetPassword}
        loading={isLoading}
        style={styles.button}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
  },
  backLink: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 16,
  },
}); 