import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type Address = {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  icon: string;
  gradient: readonly [string, string];
};

export default function SavedAddressesScreen() {
  const { user } = useAuth();
  const [addresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Home',
      address: '123 Main Street, Apartment 4B, New York, NY 10001',
      icon: 'home',
      gradient: ['#007AFF', '#00C6FF'] as const
    },
    {
      id: '2',
      type: 'work',
      name: 'Office',
      address: '456 Business Ave, Suite 200, New York, NY 10002',
      icon: 'building',
      gradient: ['#34C759', '#00B894'] as const
    },
    {
      id: '3',
      type: 'other',
      name: 'Gym',
      address: '789 Fitness Lane, New York, NY 10003',
      icon: 'dumbbell',
      gradient: ['#FF9500', '#FFCC00'] as const
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<typeof addresses[0] | null>(null);
  const [addressName, setAddressName] = useState('');
  const [addressText, setAddressText] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddAddress = () => {
    setAddressName('');
    setAddressText('');
    setIsDefault(false);
    setEditingAddress(null);
    setShowAddModal(true);
  };

  const handleEditAddress = (address: typeof addresses[0]) => {
    setAddressName(address.name);
    setAddressText(address.address);
    setIsDefault(true);
    setEditingAddress(address);
    setShowAddModal(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement the logic to delete the address
          },
        },
      ],
    );
  };

  const handleSetDefault = (addressId: string) => {
    // Implement the logic to set the address as default
  };

  const handleSaveAddress = async () => {
    if (!addressName.trim() || !addressText.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    
    try {
      // TODO: Implement actual address saving logic
      // For now, just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAddress) {
        // Update existing address
        // Implement the logic to update the address
      } else {
        // Add new address
        // Implement the logic to add a new address
      }
      
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.addressList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((address, index) => (
          <Animated.View
            key={address.id}
            entering={FadeInDown.delay(100 * index)}
          >
            <TouchableOpacity
              style={styles.addressCard}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={address.gradient}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome5 name={address.icon} size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressText}>{address.address}</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEditAddress(address)}
              >
                <FontAwesome5 name="pencil-alt" size={16} color="#8E8E93" />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View
        entering={FadeInDown.delay(addresses.length * 100)}
        style={styles.footer}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAddress}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#007AFF', '#00C6FF'] as const}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="plus" size={20} color="#fff" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <FontAwesome5 name="times" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              label="Address Name"
              placeholder="e.g., Home, Work, Gym"
              value={addressName}
              onChangeText={setAddressName}
            />

            <TextInput
              label="Address"
              placeholder="Enter full address"
              value={addressText}
              onChangeText={setAddressText}
              multiline
              numberOfLines={3}
              style={styles.addressInput}
            />

            <TouchableOpacity
              style={styles.defaultOption}
              onPress={() => setIsDefault(!isDefault)}
            >
              <FontAwesome5
                name={isDefault ? 'check-square' : 'square'}
                size={20}
                color="#007AFF"
              />
              <Text style={styles.defaultOptionText}>Set as default address</Text>
            </TouchableOpacity>

            <Button
              title={editingAddress ? 'Update Address' : 'Save Address'}
              onPress={handleSaveAddress}
              loading={isSaving}
              style={styles.saveButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  addressList: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 20,
  },
  editButton: {
    padding: 8,
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
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  defaultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  defaultOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 10,
  },
}); 