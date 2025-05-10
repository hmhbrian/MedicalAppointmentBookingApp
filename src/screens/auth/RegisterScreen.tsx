import { View, StyleSheet, Text, Alert } from 'react-native';
import { colors } from '../../constants/colors';

const RegisterScreen = () => {
    return (
    <View style={styles.container}>

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

export default RegisterScreen;