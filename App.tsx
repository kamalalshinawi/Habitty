import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from 'expo-navigation-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/store';
import { Colors } from './src/constants/colors';
import RootNavigator from './src/navigation/RootNavigator';
import { HabitProvider } from './src/features/habits/context/HabitContext';
import { TodoProvider } from './src/features/todos/context/TodoContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function MainApp() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setHidden(true);
      } catch {
        // ignore on unsupported environments
      }
    }
  }, []);

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          primary: colors.tint,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          primary: colors.tint,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar hidden={true} style={isDark ? 'light' : 'dark'} />
      <NavigationBar hidden={true} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tint} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.tint} />
          </View>
        }
        persistor={persistor}
      >
        <ThemeProvider>
          <HabitProvider>
            <TodoProvider>
              <MainApp />
            </TodoProvider>
          </HabitProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
