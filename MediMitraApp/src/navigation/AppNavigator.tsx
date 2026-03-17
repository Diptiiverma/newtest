import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import LoginScreen from '../screens/LoginScreen';
import ShopkeeperDashboard from '../screens/ShopkeeperDashboard';
import ScanScreen from '../screens/ScanScreen';
import ScanResultScreen from '../screens/ScanResultScreen';
import PushToPatientScreen from '../screens/PushToPatientScreen';
import PatientDashboard from '../screens/PatientDashboard';
import DoseTrackerScreen from '../screens/DoseTrackerScreen';
import GuardianDashboard from '../screens/GuardianDashboard';
import SetReminderScreen from '../screens/SetReminderScreen';
import { Role } from '../constants/mockData';

export type RootStackParamList = {
  Splash: undefined;
  RoleSelect: undefined;
  Login: { role: Role };
  ShopkeeperDashboard: undefined;
  ScanScreen: undefined;
  ScanResult: { status: 'valid' | 'warning' | 'expired' };
  PushToPatient: undefined;
  PatientDashboard: undefined;
  DoseTracker: undefined;
  GuardianDashboard: undefined;
  SetReminder: { patientName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ShopkeeperDashboard" component={ShopkeeperDashboard} />
        <Stack.Screen name="ScanScreen" component={ScanScreen} />
        <Stack.Screen name="ScanResult" component={ScanResultScreen} />
        <Stack.Screen name="PushToPatient" component={PushToPatientScreen} />
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
        <Stack.Screen name="DoseTracker" component={DoseTrackerScreen} />
        <Stack.Screen name="GuardianDashboard" component={GuardianDashboard} />
        <Stack.Screen name="SetReminder" component={SetReminderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
