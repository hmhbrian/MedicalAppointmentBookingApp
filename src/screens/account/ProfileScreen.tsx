import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPatientByUserId } from '../../api/doctorApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/type';
import { Patient } from '../../types/doctor';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const navigation = useNavigation<NavigationProp>();

  const fetchPatient = async () => {
      try {
        if (!userId) throw new Error('User ID not found');
        const data = await getPatientByUserId(userId);
        setPatient(data);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu bệnh nhân');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchPatient();
  }, [userId]);

   useFocusEffect(
    useCallback(() => {
      fetchPatient(); // Refetch data when screen comes into focus
    }, [fetchPatient])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!patient) return null;

  const genderString = patient.gender === 0 ? 'Nam' : 'Nữ';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()}/>
        <Text style={styles.headerText}>Hồ sơ của bạn</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color="#007bff" />
            <Text style={styles.sectionTitle}> Thông tin cơ bản</Text>
            <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('UpdateProfile', { patient })}>
              <Text style={styles.updateText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>

          <InfoRow label="Mã bệnh nhân" value={patient.patientcode} />
          <InfoRow label="Mã bảo hiểm y tế" value={patient.insuranceNumber || 'Chưa cập nhật'} />
          <InfoRow label="Họ và tên" value={patient.fullname} />
          <InfoRow label="Số điện thoại" value={patient.phoneNumber} />
          <InfoRow label="Ngày sinh" value={patient.dateOfBirth} />
          <InfoRow label="Giới tính" value={genderString} />
          <InfoRow label="Địa chỉ" value={patient.address} />
          <InfoRow label="Email" value={patient.email} />
          <InfoRow label="Tiền sử bệnh" value={patient.medicalHistory || 'Không có'} />
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.labelColumn}>
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.valueColumn}>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#007bff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginLeft: 6,
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  updateText: {
    color: '#fff',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 8,
  },
  labelColumn: { flex: 2 },
  valueColumn: { flex: 3 },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 14,
    color: '#000',
  },
});

export default ProfileScreen;
