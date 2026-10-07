import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import TodoListScreen from '../screens/TodoListScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { HomeIcon, TodoIcon, CalendarIcon, ProfileIcon } from '../components/ui/TabIcons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <HomeIcon color={color} size={size} />;
            case 'TodoList':
              return <TodoIcon color={color} size={size} />;
            case 'Calendar':
              return <CalendarIcon color={color} size={size} />;
            case 'Profile':
              return <ProfileIcon color={color} size={size} />;
            default:
              return null;
          }
        },
        safeAreaInsets: { bottom: 0 },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.semiBold,
          fontSize: 11,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Habits' }} />
      <Tab.Screen name="TodoList" component={TodoListScreen} options={{ tabBarLabel: 'To-Do' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}