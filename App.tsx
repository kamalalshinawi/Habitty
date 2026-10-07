import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { Colors } from './src/constants/colors';
import RootNavigator from './src/navigation/RootNavigator';
import { HabitProvider } from './src/features/habits/context/HabitContext';

export default function App() {
  return (
    <HabitProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <RootNavigator />
      </NavigationContainer>
    </HabitProvider>
  );
}
