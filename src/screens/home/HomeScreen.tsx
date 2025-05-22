import React,{useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../navigation/type';
import { getDoctors, getSpecialties, getPatientByUserId } from '../../api/doctorApi';
import { Doctor, Specialty, Patient } from '../../types/doctor';
import CardView from '../../components/common/CardView';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, specialtiesData, userData] = await Promise.all([
          getDoctors(),
          getSpecialties(),
          getPatientByUserId(user as number),
        ]);
        setDoctors(doctorsData);
        setSpecialties(specialtiesData.slice(0, 8)); // Limit to 8 specialties for display
        setPatient(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const quickAccessButtons = [
    { title: 'Đặt khám bác sĩ', icon: 'person', onPress: () => navigation.navigate('DoctorList',{specialtyId: undefined}) },
    { title: 'Chat với bác sĩ', icon: 'chat', onPress: () => {} },
    { title: 'Kết quả', icon: 'description', onPress: () => {} },
    { title: 'Đặt lịch tiêm chủng', icon: 'vaccines', onPress: () => {} },
  ];

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity style={styles.doctorCard}>
      <Image source={item.avatar_url && item.avatar_url.trim() !== '' 
      ? { uri: item.avatar_url }
      : require('../../assets/images/default-avatar.png')} 
      style={styles.doctorAvatar} />
      <Text style={styles.doctorName}>Bác sĩ {item.fullname}</Text>
      <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
    </TouchableOpacity>
  );

  const renderSpecialtyItem = ({ item }: { item: Specialty }) => (
    <TouchableOpacity
      style={styles.specialtyCard}
      onPress={() => navigation.navigate('DoctorList', { specialtyId: item.id })}
    >
      <Image source={item.icon && item.icon.trim() !== '' 
        ? { uri: item.icon }
        : require('../../assets/images/default-avatar.png')} 
      style={styles.specialtyIcon} />
      <Text style={styles.specialtyText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Image
            source={
              patient?.avatar_url && patient.avatar_url.trim() !== ''
                ? { uri: patient?.avatar_url }
                : require('../../assets/images/default-avatar.png')
            }
            style={styles.avatar}
          />
          <View style={styles.greeting}>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.userName}>{patient?.fullname}</Text>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Chat ngay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Access Buttons */}
      <CardView>
        <View style={styles.quickAccessGrid}>
          {quickAccessButtons.map((button, index) => (
            <TouchableOpacity key={index} style={styles.quickAccessCard} onPress={button.onPress}>
              <Icon name={button.icon} size={30} color={colors.primary} />
              <Text style={styles.quickAccessText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </CardView>
      
       {/* Doctor List Section */}
      <CardView>
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
      </CardView>
          
      {/* Specialty Section */}    
      <CardView>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Khám theo chuyên khoa</Text>
          <TouchableOpacity>
            <Icon name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {specialties.length > 0 ? (
          <FlatList
            data={specialties}
            renderItem={renderSpecialtyItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            columnWrapperStyle={styles.columnWrapper}
          />
        ) : (
          <Text style={styles.noDataText}>Không có chuyên khoa nào để hiển thị</Text>
        )}
      </CardView>
      
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    marginVertical: 14,
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
    paddingLeft: 0,
  },
  doctorCard: {
    width: 120,
    alignItems: 'center',
    marginRight: 10,
  },
  doctorAvatar: {
    width: 65,
    height: 65,
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
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  specialtyCard: {
    width: '24%',
    alignItems: 'center',
  },
  specialtyText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  specialtyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: colors.gray,
    marginVertical: 10,
  },
});

export default HomeScreen;