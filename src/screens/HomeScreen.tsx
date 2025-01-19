import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface Tugas {
  _id: string;
  mataKuliah: string;
  tugasKe: number;
  tenggatKumpul: string;
}

const HomeScreen = () => {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  const fetchTugas = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/tugas');
      setTugas(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch tasks.');
    }
  }, []);

  const fetchUserName = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/profile');
      setUserName(response.data.name);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get('/tugas');
      setTugas(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to refresh tasks.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTugas();
    fetchUserName();
  }, [fetchTugas, fetchUserName]);

  const renderTaskRow = ({ item }: { item: Tugas }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.cellText]}>{item.mataKuliah}</Text>
      <Text style={[styles.cell, styles.cellText]}>{item.tugasKe}</Text>
      <Text style={[styles.cell, styles.cellText]}>
        {new Date(item.tenggatKumpul).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {userName}!</Text>
      <Text style={styles.title}>Daftar Tugas</Text>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.cellHeader]}>Mata Kuliah</Text>
          <Text style={[styles.cell, styles.cellHeader]}>Tugas Ke</Text>
          <Text style={[styles.cell, styles.cellHeader]}>Tenggat</Text>
        </View>
        {/* Table Body */}
        <FlatList
          data={tugas}
          keyExtractor={(item) => item._id}
          renderItem={renderTaskRow}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEF',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    paddingTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFC1CC',
  },
  cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
  },
});

export default HomeScreen;
