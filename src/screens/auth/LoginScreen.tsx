import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../constants/colors';
import { login } from '../../api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { AuthStackParamList } from '../../navigation/type';
import { validateEmail, validatePassword } from '../../utils/validators';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    //const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    //if (!emailValid) setEmailError('Invalid email format');
    if (!passwordValid) setPasswordError('Password must be at least 6 characters');

    if (phoneNumber && passwordValid) {
      setLoading(true);
      try {
        const response = await login({ phoneNumber, password });
        dispatch(setCredentials({ token: response.token }));
      } catch (error) {
        Alert.alert('Login Failed', 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        error={passwordError}
      />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      <Text style={styles.registerText}>
        Don't have an account?{' '}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
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