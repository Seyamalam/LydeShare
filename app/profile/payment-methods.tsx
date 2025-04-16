import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '../components/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';

type BasePaymentMethod = {
  id: string;
  name: string;
  isDefault: boolean;
};

type CashPaymentMethod = BasePaymentMethod & {
  type: 'cash';
  icon: 'money';
};

type MobilePaymentMethod = BasePaymentMethod & {
  type: 'mobile';
  logo: any;
  accountNumber: string;
};

type CardPaymentMethod = BasePaymentMethod & {
  type: 'card';
  logo: any;
  cardNumber: string;
  expiryDate: string;
};

type PaymentMethod = CashPaymentMethod | MobilePaymentMethod | CardPaymentMethod;

// Mock data for payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    type: 'cash',
    name: 'Cash',
    icon: 'money' as const,
    isDefault: true,
  },
  {
    id: 'bkash',
    type: 'mobile',
    name: 'bKash',
    logo: require('../../assets/Bikash-Logo.png'),
    isDefault: false,
    accountNumber: '01712345678',
  },
  {
    id: 'nagad',
    type: 'mobile',
    name: 'Nagad',
    logo: require('../../assets/Nagad-Logo.png'),
    isDefault: false,
    accountNumber: '01712345678',
  },
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    logo: require('../../assets/Visa_Logo.png'),
    isDefault: false,
    cardNumber: '**** **** **** 1234',
    expiryDate: '12/25',
  },
];

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    );
    Alert.alert('Default Payment Method', 'Default payment method updated successfully.');
  };

  const handleDeleteMethod = (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
            if (selectedMethod === methodId) {
              setSelectedMethod(null);
            }
          },
        },
      ],
    );
  };

  const handleAddPaymentMethod = () => {
    setIsAddingCard(true);
    Alert.alert(
      'Add Payment Method',
      'This would open a form to add a new payment method.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            // Simulate adding a new payment method
            const newMethod: CardPaymentMethod = {
              id: `card-${Date.now()}`,
              type: 'card',
              name: 'New Card',
              logo: require('../../assets/Visa_Logo.svg'),
              isDefault: false,
              cardNumber: '**** **** **** 5678',
              expiryDate: '10/26',
            };
            setPaymentMethods([...paymentMethods, newMethod]);
            setSelectedMethod(newMethod.id);
            setIsAddingCard(false);
          },
        },
      ],
    );
  };

  const renderPaymentMethod = (method: PaymentMethod) => {
    const isSelected = selectedMethod === method.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.paymentMethod,
          isSelected && styles.selectedPaymentMethod,
        ]}
        onPress={() => handleSelectMethod(method.id)}
      >
        <View style={styles.paymentMethodContent}>
          {'logo' in method ? (
            <View style={styles.logoContainer}>
              <Image 
                source={method.logo}
                style={styles.paymentLogo}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.paymentMethodIcon}>
              <FontAwesome name={method.icon} size={24} color="#007AFF" />
            </View>
          )}
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodName}>{method.name}</Text>
            {'accountNumber' in method && (
              <Text style={styles.paymentMethodDetails}>{method.accountNumber}</Text>
            )}
            {'cardNumber' in method && (
              <Text style={styles.paymentMethodDetails}>
                {method.cardNumber} • Expires {method.expiryDate}
              </Text>
            )}
            {method.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.paymentMethodActions}>
          {!method.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(method.id)}
            >
              <FontAwesome name="star-o" size={20} color="#007AFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteMethod(method.id)}
          >
            <FontAwesome name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <Animated.View
              key={method.id}
              entering={FadeInDown.delay(200)}
            >
              {renderPaymentMethod(method)}
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="credit-card" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No payment methods yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add a payment method to make booking rides easier
            </Text>
          </View>
        )}
      </ScrollView>

      <Animated.View 
        style={styles.footer}
        entering={FadeInDown.delay(400)}
      >
        <Button
          title="Add Payment Method"
          onPress={handleAddPaymentMethod}
          loading={isAddingCard}
          style={styles.addButton}
        />
        
        {selectedMethod && (
          <Button
            title="Use Selected Payment Method"
            onPress={() => {
              Alert.alert('Success', 'Payment method selected successfully.');
              router.back();
            }}
            style={styles.selectButton}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  paymentLogo: {
    width: '100%',
    height: '100%',
  },
  paymentMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: '#666',
  },
  defaultBadge: {
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  defaultText: {
    fontSize: 12,
    color: '#007AFF',
  },
  paymentMethodActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  addButton: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  selectButton: {
    borderRadius: 12,
    backgroundColor: '#34C759',
  },
}); 