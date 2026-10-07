import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  TodoList: undefined;
  Calendar: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  HabitDetail: { habitId: string };
  AddHabit: undefined;
};

export type RootTabParamList = TabParamList;