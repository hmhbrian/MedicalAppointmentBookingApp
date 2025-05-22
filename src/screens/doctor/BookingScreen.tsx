import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RootState } from '../../store/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/type';
import { getDoctorById, getDoctorSchedules, createAppointment, getPatientByUserId } from '../../api/doctorApi';
import { Doctor, Schedule, Patient } from '../../types/doctor';
import { generateTimeSlots, formatDate, formatDateNoWeek } from '../../utils/helpers';

type BookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Booking'>;
type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;

const BookingScreen = () => {
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const route = useRoute<BookingScreenRouteProp>();
  const { doctorId } = route.params;

  const user = useSelector((state: RootState) => state.auth.userId);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorData, patientData] = await Promise.all([
          getDoctorById(doctorId),
          getPatientByUserId(user as number),
        ]);
        setDoctor(doctorData);
        setPatient(patientData);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load doctor or patient.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId, user]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (doctorId) {
        try {
          const schedulesData = await getDoctorSchedules(doctorId);
          setSchedules(schedulesData);
          if (schedulesData.length > 0) {
            setSelectedSchedule(schedulesData[0]);
          }
        } catch (error) {
          console.error('Error fetching schedules:', error);
          Alert.alert('Error', 'Failed to load schedules.');
        }
      }
    };
    fetchSchedules();
  }, [doctorId]);

  
  // useEffect(() => {
  //   if (selectedSchedule) {
  //     const slots = generateTimeSlots(selectedSchedule.start_time, selectedSchedule.end_time);
  //     setTimeSlots(slots);
  //     setSelectedTimeSlot(slots[0] || null);
  //   }
  // }, [selectedSchedule]);

  // const renderTimeSlot = ({ item }: { item: string }) => (
  //   <TouchableOpacity
  //     style={[
  //       styles.timeSlot,
  //       selectedTimeSlot === item && styles.selectedTimeSlot,
  //     ]}
  //     onPress={() => setSelectedTimeSlot(item)}
  //   >
  //     <Text style={[styles.timeSlotText, selectedTimeSlot === item && styles.selectedTimeSlotText]}>
  //       {item}
  //     </Text>
  //   </TouchableOpacity>
  // );

  const getUniqueDates = () => {
    const dates = schedules.map(s => s.date);
    return Array.from(new Set(dates));
  };

  const getSchedulesForDate = (date: string) => {
    return schedules.filter(s => s.date === date);
  };

  const handleConfirmBooking = async () => {
    if ( !selectedSchedule) {
      Alert.alert('Error', 'Please select time.');
      return;
    }
    const currentDate = new Date();
    const presentTime = currentDate.toISOString();
    setLoading(true);
    try {
      await createAppointment({
        patientId: patient?.id as number,
        doctorId,
        doctorScheduleId: selectedSchedule?.id as number,
        appointmentTime: " ",
      });
      Alert.alert('Success', 'Appointment booked successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !doctor || !patient) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch khám với bác sĩ</Text>
      </View>

      {/* Doctor Information */}
      <View style={styles.doctorCard}>
        <Image source={doctor.avatar_url && doctor.avatar_url.trim() !== '' 
      ? { uri: doctor.avatar_url }
      : require('../../assets/images/default-avatar.png')}  style={styles.doctorAvatar} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.fullname}</Text>
          <View style={styles.specialtiesContainer}>
            <Text style={styles.specialty}>Chuyên khoa: {doctor.specialty}</Text>
          </View>
        </View>
      </View>

      {/* Schedule Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chọn ngày khám</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {getUniqueDates().map(date => (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateButton,
                selectedDate === date && styles.selectedDateButton,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dateButtonText,
                selectedDate === date && styles.selectedDateButtonText,
              ]}>
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedDate ? (
          getSchedulesForDate(selectedDate).length > 0 ? (
            getSchedulesForDate(selectedDate).map(schedule => {
              const remaining = schedule.maxPatients - schedule.bookedPatients;
              return (
                <TouchableOpacity
                  key={schedule.id}
                  style={[
                    styles.scheduleCard,
                    selectedSchedule?.id === schedule.id && styles.selectedScheduleCard,
                  ]}
                  onPress={() => {
                    if (remaining > 0) setSelectedSchedule(schedule);
                    else Alert.alert('Hết lượt khám', 'Ca này đã đầy bệnh nhân');
                  }}
                >
                  <Text style={styles.shiftText}>Ca: {schedule.shift}</Text>
                  <Text style={styles.textinput}>Thời gian: {schedule.start_time} - {schedule.end_time}</Text>
                  <Text style={styles.textinput}>Địa điểm: {schedule.location}</Text>
                  <Text style={styles.textinput}>Số bệnh nhân còn nhận: {remaining}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={{ color: colors.red }}>Không có lịch khám nào trong ngày.</Text>
          )
        ) : (
          <Text style={{ color: colors.red }}>Vui lòng chọn ngày để xem lịch khám.</Text>
        )}
      </View>


      {/* Patient Information */}
      <Text style={styles.cardTitle}>Thông tin bệnh nhân</Text>
      <View style={styles.card}>
        
        <View style={styles.cardItem}>
          <Text style={styles.cardLabel}>Họ và tên:</Text>
          <Text style={styles.cardValue}>{patient.fullname}</Text>
        </View>

        <View style={styles.cardItem}>
          <Text style={styles.cardLabel}>Giới tính:</Text>
          <Text style={styles.cardValue}>{patient.gender === 0 ? 'Nam' : 'Nữ'}</Text>
        </View>

        <View style={styles.cardItem}>
          <Text style={styles.cardLabel}>Ngày sinh: </Text>
          <Text style={styles.cardValue}>{formatDateNoWeek(patient.dateOfBirth)}</Text>
        </View>

        <View style={styles.cardItem}>
          <Text style={styles.cardLabel}>Số điện thoại:</Text>
          <Text style={styles.cardValue}>{patient.phoneNumber}</Text>
        </View>
      </View>


      {/* Confirm Button */}
      <TouchableOpacity
        style={[styles.confirmButton, loading && styles.disabledButton]}
        onPress={handleConfirmBooking}
        disabled={loading}
      >
        <Text style={styles.confirmButtonText}>Xác nhận đặt lịch</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorAvatar: {
    width: 65,
    height: 65,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  specialty: {
    fontSize: 14,
    color: colors.primary,
  },
  textinput:{
    fontSize: 14,
    padding:3,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  scheduleContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 9,
    marginBottom: 7,
    marginLeft: 12,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 120, // hoặc dùng flex
  },
  cardValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.gray,
  },
  // Date Button
  dateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  selectedDateButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateButtonText: {
    color: colors.text,
  },
  selectedDateButtonText: {
    color: '#fff',
  },

  scheduleCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedScheduleCard: {
    borderColor: colors.primary,
    backgroundColor: '#E8F4FF',
  },
  shiftText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

});

export default BookingScreen;