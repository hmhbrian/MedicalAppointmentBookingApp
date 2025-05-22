import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/type';
import { getDoctors, getDoctorsBySpecialty } from '../../api/doctorApi';
import { Doctor } from '../../types/doctor';

type DoctorListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DoctorList'>;
type DoctorListScreenRouteProp = RouteProp<RootStackParamList, 'DoctorList'>;

const DoctorListScreen = () => {
  const navigation = useNavigation<DoctorListScreenNavigationProp>();
  const route = useRoute<DoctorListScreenRouteProp>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const specialtyId = route.params?.specialtyId;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = specialtyId
          ? await getDoctorsBySpecialty(specialtyId)
          : await getDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [specialtyId]);

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      <Image source={item.avatar_url && item.avatar_url.trim() !== '' 
      ? { uri: item.avatar_url }
      : require('../../assets/images/default-avatar.png')} 
       style={styles.doctorAvatar} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>Bác sĩ {item.fullname}</Text>
        <Text style={styles.doctorExperience}>{item.experienceYears} năm kinh nghiệm</Text>
        <View style={styles.specialtiesContainer}>
          <Text>{item.specialty}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('Booking', { doctorId: item.doctorId })}
        >
          <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {specialtyId ? 'Bác sĩ theo chuyên khoa' : 'Danh sách bác sĩ'}
        </Text>
      </View>
      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.doctorId.toString()}
        contentContainerStyle={styles.listContainer}ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#1E90FF',
  },
  headerTitle: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 16,
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  filterText: {
    fontSize: 14,
    color: colors.primary,
  },
  filterIcon: {
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorTitle: {
    fontSize: 14,
    color: colors.gray,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  doctorExperience: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    borderRadius: 20,
  },
  specialty: {
    fontSize: 14,
    color: colors.primary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  address: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 4,
    flex: 1,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginVertical: 12,
  },
});

export default DoctorListScreen;