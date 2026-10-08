import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isInitialized } = useAuth();
  const { colors } = useTheme();
  useCloudSync();

  if (!isInitialized) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.splashCircle, { backgroundColor: `${colors.tint}18` }]}>
          <FontAwesome name="check-circle" size={48} color={colors.tint} />
        </View>
        <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 24 }} />
      </View>
    );
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
