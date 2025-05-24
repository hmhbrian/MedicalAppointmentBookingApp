// AccountScreen.js
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Patient } from '../../types/doctor';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getPatientByUserId } from '../../api/doctorApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/type';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../constants/colors';

type MenuItemProps = {
  icon: string;
  text: string;
  color?: string;
  onPress?: () => void;
};

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, color = '#000', onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <Text style={styles.menuText}>{text}</Text>
      <Icon name="chevron-right" size={22} color="#ccc" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
};

const AccountScreen = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const navigation = useNavigation<AccountScreenNavigationProp>();
    const user = useSelector((state: RootState) => state.auth.userId);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
            const [patientData] = await Promise.all([
                getPatientByUserId(user as number),
            ])
            setPatient(patientData);
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to load patient.');
            } 
        };
        fetchData();
    }, [ user]);

    return (
      <View style={styles.container}>
        {/* Header Profile */}
        <View style={styles.profileCard}>
            <Image
                source={
                patient?.avatar_url && patient.avatar_url.trim() !== ''
                    ? { uri: patient?.avatar_url }
                    : require('../../assets/images/default-avatar.png')
                }
                style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{patient?.fullname}</Text>
            <Text style={styles.phone}>{patient?.phoneNumber}</Text>
            </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
            <MenuItem icon="folder-account" text="Hồ sơ y tế" color="#2979FF" onPress={() => navigation.navigate('ProfileUser')}/>
            <MenuItem icon="heart" text="Danh sách quan tâm" color="#F44336" onPress={() => {}}/>
            <MenuItem icon="alert-circle" text="Điều khoản và Quy định" color="#7E57C2" onPress={() => {}}/>
            <MenuItem icon="account-group" text="Tham gia cộng đồng" color="#4CAF50" onPress={() => {}}/>
        </View>

        <View style={styles.section}>
            <MenuItem icon="share-variant" text="Chia sẻ ứng dụng" color="#EC407A" onPress={() => {}}/>
            <MenuItem icon="headset" text="Liên hệ & hỗ trợ" color="#03A9F4" onPress={() => {}}/>
            <MenuItem icon="cog-outline" text="Cài đặt" color="#424242" onPress={() => {}}/>
            <MenuItem
              icon="logout"
              text="Đăng xuất"
              color="#E53935"
              onPress={() => {
                Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
                  {
                    text: 'Hủy',
                    style: 'cancel',
                  },
                  {
                    text: 'Đăng xuất',
                    onPress: () => {
                      dispatch(logout());
                    },
                  },
                ]);
              }}
            />
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    paddingHorizontal: 16 
 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  profileCard: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#66CCFF', 
    padding: 16, 
    borderRadius: 12,
    marginTop: 20, 
    marginBottom: 16,
  },
  name: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff'
},
  phone: { 
    fontSize: 14, 
    color: '#666',
    marginTop: 6,
  },
  section: {
    backgroundColor: '#fff', 
    borderRadius: 12,
    marginBottom: 16, 
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 15, 
    paddingHorizontal: 16,
    borderBottomWidth: 0.5, 
    borderColor: '#ddd',
  },
  menuIcon: {
    marginRight: 13,
  },
  menuText: {
    fontSize: 16,
  },
  version: {
    textAlign: 'center', color: '#999',
    marginTop: 12, fontSize: 12,
  },
});

export default AccountScreen;
