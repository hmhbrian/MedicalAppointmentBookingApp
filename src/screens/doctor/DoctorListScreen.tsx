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
    <TouchableOpacity style={styles.doctorCard}>
      <Image source={{ uri: item.avatar_url }} style={styles.doctorAvatar} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>Bác sĩ {item.fullname}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {specialtyId ? 'Bác sĩ theo chuyên khoa' : 'Danh sách bác sĩ'}
        </Text>
      </View>
      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.doctorId.toString()}
        contentContainerStyle={styles.listContainer}
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 16,
  },
  listContainer: {
    padding: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
  },
});

export default DoctorListScreen;