import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Appointment } from '../../types/doctor';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/type';
import { cancelAppointmentById } from '../../api/doctorApi';

type RouteParams = {
  AppointmentDetail: { appointment: Appointment };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;



const AppointmentDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'AppointmentDetail'>>();
  const { appointment } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const user = useSelector((state: RootState) => state.auth.userId);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'xác nhận':
        return '#28a745'; // xanh lá
      case 'chưa xác nhận':
      case 'chờ xác nhận':
        return '#ffc107'; // vàng
      case 'hủy':
      case 'từ chối':
        return '#dc3545'; // đỏ
      default:
        return '#007AFF';
    }
  };

  const isCancelable = appointment.status.toLowerCase() === 'chờ xác nhận';

  const handleCancelConfirm = async () => {
    try {
      await cancelAppointmentById(appointment.id, cancelReason, user as number);
      Alert.alert('Thành công', 'Lịch hẹn đã được huỷ');
      setShowReasonModal(false);
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi huỷ lịch hẹn:', error);
      Alert.alert('Lỗi', 'Không thể huỷ lịch hẹn. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📋 Chi tiết lịch hẹn</Text>

      <ScrollView contentContainerStyle={styles.card}>
        <Text style={styles.itemText}>👨‍⚕️ Bác sĩ: <Text style={styles.bold}>{appointment.doctorName}</Text></Text>
        <Text style={styles.itemText}>📅 Ngày hẹn: <Text style={styles.bold}>{appointment.appointmentDate}</Text></Text>
        <Text style={styles.itemText}>🏥 Phòng: <Text style={styles.bold}>{appointment.roomName}</Text></Text>
        <Text style={styles.itemText}>⏰ Thời gian: <Text style={styles.bold}>{appointment.appointmentTime || 'Chưa có'}</Text></Text>
        <Text style={[styles.itemText, { color: getStatusColor(appointment.status) }]}>
          📝 Trạng thái: <Text style={styles.bold}>{appointment.status}</Text>
        </Text>

        {/* Nút Huỷ nếu hợp lệ */}
        {isCancelable && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowReasonModal(true)}
          >
            <Text style={styles.cancelButtonText}>Huỷ lịch hẹn</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={showReasonModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReasonModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lý do huỷ lịch hẹn</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lý do..."
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setShowReasonModal(false)}
              >
                <Text>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#dc3545' }]}
                onPress={handleCancelConfirm}
                disabled={!cancelReason.trim()}
              >
                <Text style={{ color: '#fff' }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#66CCFF',
    padding: 16,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
  },
  bold: {
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
});

export default AppointmentDetailScreen;
