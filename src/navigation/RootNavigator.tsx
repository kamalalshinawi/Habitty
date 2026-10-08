import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import { RootStackParamList } from './types';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import AddTodoScreen from '../screens/AddTodoScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useCloudSync } from '../features/auth/hooks/useCloudSync';
import SplashScreen from '../components/ui/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isInitialized } = useAuth();
  useCloudSync();

  if (!isInitialized) {
    return <SplashScreen message="Restoring your habits & goals..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
          <Stack.Screen
            name="AddHabit"
            component={AddHabitScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="AddTodo"
            component={AddTodoScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
