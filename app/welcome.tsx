import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from './components/Button';

export default function WelcomeScreen() {
  const handleSignIn = () => {
    router.replace('/(auth)/login');
  };

  const handleSignUp = () => {
    router.replace('/(auth)/signup');
  };

  const handleContinueWithGoogle = () => {
    // Simulate Google sign-in
    console.log('Google sign-in pressed');
    // In a real app, this would trigger Google authentication
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.title}>Welcome to Ryde</Text>
        <Text style={styles.subtitle}>
          Your trusted ride-sharing app in Bangladesh
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={handleSignIn}
          style={styles.signInButton}
        />
        
        <Button
          title="Create Account"
          onPress={handleSignUp}
          variant="outline"
          style={styles.signUpButton}
        />
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>
        
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleContinueWithGoogle}
        >
          <FontAwesome name="google" size={20} color="#333" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  signInButton: {
    marginBottom: 15,
  },
  signUpButton: {
    marginBottom: 30,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#8E8E93',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 15,
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  linkText: {
    color: '#007AFF',
  },
}); 