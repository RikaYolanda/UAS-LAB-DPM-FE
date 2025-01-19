import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import TugasScreen from '../screens/TugasScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#FFEBEF', height: 90, paddingBottom: 10, paddingTop: 10, borderColor: '#FF9AA2', borderWidth: 1 },
        tabBarActiveTintColor: '#FF9AA2',
        tabBarInactiveTintColor: '#FF9AA2',
        tabBarLabelStyle: { fontSize: 12, marginTop: 4 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Tugas') {
            iconName = 'inbox';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = 'user';
            return <AntDesign name={iconName} size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tugas" component={TugasScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
