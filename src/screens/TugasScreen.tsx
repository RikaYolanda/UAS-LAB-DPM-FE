import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../utils/axiosInstance';

interface Tugas {
  _id: string;
  mataKuliah: string;
  tugasKe: number;
  tenggatKumpul: string;
}

const TugasScreen = () => {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [mataKuliah, setMataKuliah] = useState('');
  const [tugasKe, setTugasKe] = useState('');
  const [tenggatKumpul, setTenggatKumpul] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTugas = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/tugas');
      setTugas(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch tugas.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateTugas = async () => {
    if (!mataKuliah || !tugasKe || !tenggatKumpul) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }

    try {
      if (editMode && editingId) {
        await axiosInstance.put(`/tugas/${editingId}`, {
          mataKuliah,
          tugasKe: Number(tugasKe),
          tenggatKumpul,
        });
        Alert.alert('Success', 'Tugas updated successfully!');
      } else {
        const response = await axiosInstance.post('/tugas', {
          mataKuliah,
          tugasKe: Number(tugasKe),
          tenggatKumpul,
        });
        Alert.alert('Success', 'Tugas added successfully!');
        setTugas((prev) => [...prev, response.data]);
      }
      resetForm();
      fetchTugas();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save tugas.');
    }
  };

  const handleDeleteTugas = async (id: string) => {
    try {
      await axiosInstance.delete(`/tugas/${id}`);
      Alert.alert('Success', 'Tugas deleted successfully!');
      fetchTugas();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete tugas.');
    }
  };

  const handleEditTugas = (tugas: Tugas) => {
    setMataKuliah(tugas.mataKuliah);
    setTugasKe(String(tugas.tugasKe));
    setTenggatKumpul(tugas.tenggatKumpul);
    setEditMode(true);
    setEditingId(tugas._id);
  };

  const resetForm = () => {
    setMataKuliah('');
    setTugasKe('');
    setTenggatKumpul('');
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const renderTugasCard = ({ item }: { item: Tugas }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.mataKuliah}</Text>
        <TouchableOpacity onPress={() => handleEditTugas(item)}>
          <AntDesign name="edit" size={20} color="#FF9AA2" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText}>
        <Text style={styles.cardLabel}>Tugas Ke:</Text> {item.tugasKe}
      </Text>
      <Text style={styles.cardText}>
        <Text style={styles.cardLabel}>Tenggat:</Text>{' '}
        {new Date(item.tenggatKumpul).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTugas(item._id)}
      >
        <AntDesign name="delete" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daftar Tugas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mata Kuliah"
          value={mataKuliah}
          onChangeText={setMataKuliah}
        />
        <TextInput
          style={styles.input}
          placeholder="Tugas Ke"
          keyboardType="numeric"
          value={tugasKe}
          onChangeText={setTugasKe}
        />
        <TextInput
          style={styles.input}
          placeholder="Tenggat Kumpul (YYYY-MM-DD)"
          value={tenggatKumpul}
          onChangeText={setTenggatKumpul}
        />
      </View>
      <Pressable style={styles.addButton} onPress={handleAddOrUpdateTugas}>
        <Text style={styles.addButtonText}>{editMode ? 'Update Tugas' : 'Tambah Tugas'}</Text>
      </Pressable>
      <FlatList
        data={tugas}
        keyExtractor={(item) => item._id}
        renderItem={renderTugasCard}
        refreshing={loading}
        onRefresh={fetchTugas}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 20,
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#FFEBEF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    borderColor: '#FFC1CC',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Comic Sans MS',
  },
  card: {
    backgroundColor: '#FFEBEF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC1CC',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
  },
  cardText: {
    fontSize: 16,
    color: '#FF9AA2',
    fontFamily: 'Comic Sans MS',
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: 'bold',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF9AA2',
    padding: 10,
    borderRadius: 5,
  },
});

export default TugasScreen;
