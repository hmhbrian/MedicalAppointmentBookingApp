import React, {useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/home/HomeScreen';
import FeedBackScreen from '../screens/home/FeedBackScreen';
import AccountScreen from '../screens/account/AccountScreen';
import AppointmentListScreen from '../screens/appointment/AppointmentListScreen';
import { MainTabParamList } from './type';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Appointments') iconName = 'date-range';
          else if (route.name === 'Profile') iconName = 'account-circle';
          else iconName = 'comment';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="Appointments" component={AppointmentListScreen} options={{ tabBarLabel: 'Lịch hẹn' }} />
      <Tab.Screen name="Feedback" component={FeedBackScreen} options={{ tabBarLabel: 'Phản hồi' }} />
      <Tab.Screen name="Profile" component={AccountScreen} options={{ tabBarLabel: 'Hồ sơ' }} />
    </Tab.Navigator>
  );
};

export default MainNavigator;