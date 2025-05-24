import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Patient } from '../../types/doctor';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/type';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updateProfile } from '../../api/doctorApi';
import { RadioButton } from 'react-native-paper';

type RouteParams = {
  UpdateProfile: { patient: Patient };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const UpdateProfileScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'UpdateProfile'>>();
  const { patient } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [fullname, setFullname] = useState(patient.fullname || '');
  const [email, setEmail] = useState(patient.email || '');
  const [phoneNumber, setPhoneNumber] = useState(patient.phoneNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(patient.dateOfBirth || '');
  const [gender, setGender] = useState(patient.gender?.toString() || '0'); // 0: Nam, 1: Nữ
  const [address, setAddress] = useState(patient.address || '');
  const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory || '');
  const [insuranceNumber, setInsuranceNumber] = useState(patient.insuranceNumber || '');

  const handleUpdate = async () => {
    try {
      const updatedData: Partial<Patient> = {
        fullname,
        email,
        phoneNumber,
        dateOfBirth,
        gender: parseInt(gender),
        address,
        medicalHistory: medicalHistory,
        insuranceNumber: insuranceNumber,
      };

      await updateProfile(patient.id, updatedData);
      Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Icon name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()}/>
            <Text style={styles.headerText}>Chỉnh sửa thông tin cá nhân</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.label}>Họ tên:</Text>
            <TextInput style={styles.input} value={fullname} onChangeText={setFullname} />

            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

            <Text style={styles.label}>Ngày sinh (yyyy-mm-dd):</Text>
            <TextInput style={styles.input} value={dateOfBirth} onChangeText={setDateOfBirth} />

           <Text style={styles.label}>Giới tính:</Text>
           <View style={styles.radioGroup}>
                <RadioButton.Android
                    value="0"
                    status={gender === '0' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('0')}
                    />
                <Text style={styles.radioLabel}>Nam</Text>
                <RadioButton.Android
                    value="1"
                    status={gender === '1' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('1')}
                    />
                <Text style={styles.radioLabel}>Nữ</Text>
            </View>
            <Text style={styles.label}>Địa chỉ:</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />

            <Text style={styles.label}>Tiền sử bệnh:</Text>
            <TextInput style={styles.input} value={medicalHistory} onChangeText={setMedicalHistory} />

            <Text style={styles.label}>Số BHYT:</Text>
            <TextInput style={styles.input} value={insuranceNumber} onChangeText={setInsuranceNumber} />

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateText}>Lưu thông tin</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  label: {
    fontWeight: 'bold',
    marginTop: 3,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioLabel: {
    marginRight: 16,
  },
});

export default UpdateProfileScreen;
