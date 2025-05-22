import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { AuthStackParamList } from '../../navigation/type';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import RadioButtonGroup from '../../components/common/RadioButtonGroup';
import { register } from '../../api/authApi';


type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState(0); // 0 for male, 1 for female
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { label: 'Nam', value: 0 },
    { label: 'Nữ', value: 1 },
  ];

  const validateForm = () => {
    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !dateOfBirth ||
      !address ||
      !password ||
      !confirmPassword ||
      !medicalHistory ||
      !insuranceNumber
    ) {
      Alert.alert('Error', 'Vui lòng điền đầy đủ tất cả các trường.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Mật khẩu xác nhận không khớp.');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Email không hợp lệ.');
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Số điện thoại phải có 10 chữ số.');
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      Alert.alert('Error', 'Ngày sinh phải có định dạng YYYY-MM-DD (ví dụ: 1995-05-20).');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        fullname,
        email,
        phoneNumber,
        dateOfBirth,
        gender,
        address,
        password,
        medicalHistory,
        insuranceNumber,
      });
      Alert.alert('Success', 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert('Error', 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <Input
        value={fullname}
        onChangeText={setFullname}
        placeholder="Họ và tên"
      />
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <Input
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
      />
      <Input
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder="Ngày sinh (YYYY-MM-DD)"
      />
      <Text style={styles.label}>Giới tính</Text>
      <RadioButtonGroup
        options={genderOptions}
        selectedValue={gender}
        onValueChange={setGender}
      />
      <Input
        value={address}
        onChangeText={setAddress}
        placeholder="Địa chỉ"
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        secureTextEntry
      />
      <Input
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
      />
      <Input
        value={medicalHistory}
        onChangeText={setMedicalHistory}
        placeholder="Tiền sử bệnh"
      />
      <Input
        value={insuranceNumber}
        onChangeText={setInsuranceNumber}
        placeholder="Số bảo hiểm"
      />

      <Button
        title="Đăng ký"
        onPress={handleRegister}
        disabled={loading}
      />
      <Text style={styles.loginText}>
        Đã có tài khoản?{' '}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          Đăng nhập
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  loginText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.gray,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;