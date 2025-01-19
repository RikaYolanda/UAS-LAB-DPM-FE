import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/profile');
        setUser(response.data);
      } catch (error: any) {
        console.error('Error fetching user data:', error.response || error.message);
        Alert.alert(
          'Error',
          error.response?.data?.error || 'Failed to fetch user data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        navigation.replace('Login');
        return;
      }

      await axiosInstance.post('/profile/logout');

      await AsyncStorage.removeItem('jwtToken');

      Alert.alert('Logout', 'You have successfully logged out.');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again later.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9AA2" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>My Profile</Text>
        <Text style={styles.errorText}>Failed to load user data.</Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.infoLabel}>Name:</Text>
        <Text style={styles.infoText}>{user.name}</Text>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoText}>{user.email}</Text>
      </View>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    paddingTop: 50,
    marginBottom: 20,
  },
  profileInfo: {
    backgroundColor: '#FFEBEF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC1CC',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Comic Sans MS',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6F91',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen;
