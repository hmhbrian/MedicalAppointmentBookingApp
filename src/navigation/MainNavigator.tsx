import React, {useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/home/HomeScreen';
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointments" component={() => null} />
      <Tab.Screen name="Profile" component={() => null} />
      <Tab.Screen name="Feedback" component={() => null} />
    </Tab.Navigator>
  );
};

export default MainNavigator;