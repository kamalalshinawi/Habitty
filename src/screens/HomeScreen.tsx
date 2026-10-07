import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import { useHabits } from '../features/habits/hooks/useHabits';
import HomeHeader from '../components/ui/HomeHeader';
import DailyProgress from '../components/ui/DailyProgress';
import HabitCard from '../components/ui/HabitCard';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import AddHabitModal from '../components/ui/AddHabitModal';
import { formatDateKey } from '../utils/dateHelpers';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { habits, toggleDay, getStatus, getStreak, todayCompleted, addHabit } = useHabits();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const today = formatDateKey(new Date());

  const handleToggle = (habitId: string) => {
    toggleDay(today, habitId);
  };

  const handleHabitPress = (habitId: string) => {
    navigation.navigate('HabitDetail', { habitId });
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="calendar-check-o" size={44} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the &quot;+&quot; button below to start building your daily routines!
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      </View>

      <FloatingActionButton onPress={() => setIsAddModalOpen(true)} />

      <AddHabitModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={addHabit}
      />
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
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
