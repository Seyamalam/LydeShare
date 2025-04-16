import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Keyboard, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function PhoneVerificationScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { verifyPhone } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Start countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    // Simulate resending code
    setCountdown(60);
    setCanResend(false);
    Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the complete verification code.');
      return;
    }

    setIsVerifying(true);
    Keyboard.dismiss();

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, consider any 6-digit code as valid
      // In a real app, this would verify against the actual OTP sent
      await verifyPhone({ phone, otp: otpString });
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Verification Failed', 'The code you entered is incorrect. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Phone Verification</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Enter the verification code sent to
        </Text>
        <Text style={styles.phoneNumber}>{phone}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Button
          title="Verify"
          onPress={handleVerify}
          loading={isVerifying}
          style={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            {canResend ? (
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            ) : (
              `Resend code in ${countdown}s`
            )}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
  },
  verifyButton: {
    width: '100%',
    marginBottom: 20,
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
}); 