import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../constants/colors';
import { login } from '../../api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { AuthStackParamList } from '../../navigation/type';
import { validatePassword } from '../../utils/validators';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    setPasswordError('');

    const passwordValid = validatePassword(password);

    if (!passwordValid) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ phoneNumber, password });

      // Lưu token và thông tin user vào AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('fullname', response.fullname);

      // Lưu vào Redux
      dispatch(setCredentials({ token: response.token,role: response.role, fullname: response.fullname, userId: response.userId}));

      // Điều hướng đến Home
      //navigation.navigate('Main');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Image
            source={require('../../assets/images/Login.png')}
            style={styles.avatar}
          />
        <Text style={styles.title}>Đăng Nhập</Text>
        <Input
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Số điện thoại"
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Mật khẩu"
          secureTextEntry
          error={passwordError}
        />
        <Button title="Đăng Nhập" onPress={handleLogin} disabled={loading} />
        <Text style={styles.registerText}>
          Bạn chưa có tài khoản?{' '}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            Đăng Ký
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  avatar: {
    width: 280,
    height: 280,
    borderRadius: 25,
    marginLeft: 47,
    marginTop:20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.gray,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;