import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token } = response.data;
      await AsyncStorage.setItem('jwtToken', token);
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Main') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to manage your tasks</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#FFB6C1"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#FFB6C1"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}> Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEF',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFEBEF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC1CC',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFB6C1',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF6F6',
    borderColor: '#FFC1CC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Comic Sans MS',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    fontSize: 14,
    color: '#FFB6C1',
    fontFamily: 'Comic Sans MS',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
  },
});

export default LoginScreen;
