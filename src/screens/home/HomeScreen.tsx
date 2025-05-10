import React,{useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../navigation/type';
import { getDoctors, getSpecialties } from '../../api/doctorApi';
import { Doctor, Specialty } from '../../types/doctor';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, specialtiesData] = await Promise.all([
          getDoctors(),
          getSpecialties(),
        ]);
        setDoctors(doctorsData);
        setSpecialties(specialtiesData.slice(0, 8)); // Limit to 8 specialties for display
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickAccessButtons = [
    { title: 'Đặt khám bác sĩ', icon: 'person', onPress: () => {} },
    { title: 'Chat với bác sĩ', icon: 'chat', onPress: () => {} },
    { title: 'Gọi video bác sĩ', icon: 'videocam', onPress: () => {} },
    { title: 'Kết quả', icon: 'description', onPress: () => {} },
    { title: 'Đặt lịch tiêm chủng', icon: 'vaccines', onPress: () => {} },
    { title: 'Xem lịch đặt', icon: 'calendar-today', onPress: () => {} },
    { title: 'Cộng đồng', icon: 'group', onPress: () => {} },
  ];

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity style={styles.doctorCard}>
      <Image source={{ uri: item.avatar_url }} style={styles.doctorAvatar} />
      <Text style={styles.doctorName}>Bác sĩ {item.fullname}</Text>
      <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
    </TouchableOpacity>
  );

  const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
    <TouchableOpacity
      style={styles.specialtyCard}
      onPress={() => navigation.navigate('DoctorList', { specialtyId: item.id })}
    >
      <Icon name={item.icon || 'favorite'} size={40} color={colors.primary} />
      <Text style={styles.specialtyText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Chat cùng bác sĩ chuyên khoa</Text>
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.chatButtonText}>Chat ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Access Buttons */}
      <View style={styles.quickAccessGrid}>
        {quickAccessButtons.map((button, index) => (
          <TouchableOpacity key={index} style={styles.quickAccessCard} onPress={button.onPress}>
            <Icon name={button.icon} size={30} color={colors.primary} />
            <Text style={styles.quickAccessText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Doctor List Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bác sĩ</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DoctorList',{specialtyId: undefined})}>
          <Icon name="arrow-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.doctorId.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.doctorList}
      />

      {/* Specialty Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Khám theo chuyên khoa</Text>
        <TouchableOpacity>
          <Icon name="arrow-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {specialties.length > 0 ? (
        <View style={styles.specialtyGrid}>
          {specialties.map((specialty) => (
            <View key={specialty.id.toString()}>
              {renderSpecialtyItem({ item: specialty })}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>Không có chuyên khoa nào để hiển thị</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  banner: {
    backgroundColor: '#1E90FF',
    padding: 20,
    margin: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  quickAccessCard: {
    width: '23%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAccessText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  doctorList: {
    paddingLeft: 10,
  },
  doctorCard: {
    width: 120,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
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
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  specialtyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop:15,
    marginBottom: 20,
  },
  specialtyCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialtyText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: colors.gray,
    marginVertical: 10,
  },
});

export default HomeScreen;