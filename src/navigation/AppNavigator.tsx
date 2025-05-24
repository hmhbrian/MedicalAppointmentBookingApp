import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import DoctorListScreen from '../screens/doctor/DoctorListScreen';
import BookingScreen from '../screens/doctor/BookingScreen';
import AppointmentDetailScreen from '../screens/appointment/AppointmentDetailScreen';
import ProfileScreen from '../screens/account/ProfileScreen';
import UpdateProfileScreen from '../screens/account/UpdateProfileScreen';
import MedicalRecordsScreen from '../screens/home/MedicalRecordsScreen';
import { RootStackParamList } from './type';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setCredentials, logout } from '../store/slices/authSlice';


const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  // Khôi phục trạng thái đăng nhập từ AsyncStorage khi app khởi động
  useEffect(() => {
    const restoreAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('role');
        const fullname = await AsyncStorage.getItem('fullname');
        const id = await AsyncStorage.getItem('userId');
        
        if (token && fullname && role && id) {
           const userId = parseInt(id, 10);
           dispatch(setCredentials({ token, role, fullname, userId }));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      }
    };
    restoreAuthState();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="DoctorList" component={DoctorListScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
            <Stack.Screen name="ProfileUser" component={ProfileScreen} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
            <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;