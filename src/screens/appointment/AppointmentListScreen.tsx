import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { getAppointmentsByPatientId, getPatientByUserId } from '../../api/doctorApi';
import { Appointment } from '../../types/doctor';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/type';

type AppointmentNavigationProp = StackNavigationProp<RootStackParamList>;

const AppointmentListScreen = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.auth.userId);


  const navigation = useNavigation<AppointmentNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData] = await Promise.all([
                  getPatientByUserId(user as number),
                ]);
        const data = await getAppointmentsByPatientId(patientData.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'xác nhận':
        return '#28a745'; // xanh lá
      case 'chưa xác nhận':
        return '#ffc107'; // vàng
      case 'hủy':
      case 'từ chối':
        return '#dc3545'; // đỏ
      default:
        return '#007AFF'; // mặc định xanh dương
    }
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('AppointmentDetail', { appointment: item })}
    >
      <Text style={styles.doctorName}>👨‍⚕️ Bác sĩ: {item.doctorName}</Text>
      <Text style={styles.itemText}>📅 Ngày hẹn: {item.appointmentDate}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        📝 Trạng thái: {item.status}
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007AFF" />;

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>📋 Danh sách lịch hẹn</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có lịch hẹn</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#66CCFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
    color: '#007AFF',
  },
  itemText: {
    fontSize: 15,
    marginBottom: 4,
    color: '#555',
  },
  status: {
    fontSize: 15,
    marginTop: 8,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default AppointmentListScreen;
