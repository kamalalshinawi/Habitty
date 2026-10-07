import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { useHabits } from '../features/habits/hooks/useHabits';
import HomeHeader from '../components/ui/HomeHeader';
import DailyProgress from '../components/ui/DailyProgress';
import HabitCard from '../components/ui/HabitCard';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import { formatDateKey } from '../utils/dateHelpers';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { habits, toggleDay, getStatus, getStreak, todayCompleted } = useHabits();
  const today = formatDateKey(new Date());

  const handleToggle = (habitId: string) => {
    toggleDay(today, habitId);
  };

  const handleHabitPress = (habitId: string) => {
    navigation.navigate('HabitDetail', { habitId });
  };

  const handleAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <HomeHeader />

      <DailyProgress completed={todayCompleted} total={habits.length} />

      <View style={styles.habitsContainer}>
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              status={getStatus(today, item.id)}
              streak={getStreak(item.id)}
              onComplete={() => handleToggle(item.id)}
              onPress={() => handleHabitPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={{ height: 80 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button below to create your first habit!
              </Text>
            </View>
          }
        />
      </View>

      <FloatingActionButton onPress={handleAddHabit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  habitsContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
