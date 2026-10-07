import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Colors } from '../constants/colors';
import type { RootStackParamList } from '../navigation/types';
import { useHabitDetail } from '../features/habits/hooks/useHabitDetail';
import HabitStats from '../components/ui/HabitStats';
import HabitMonthlyCalendar from '../components/ui/HabitMonthlyCalendar';

type DetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HabitDetail'>;
type DetailRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;

export default function HabitDetailScreen() {
  const navigation = useNavigation<DetailNavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { habitId } = route.params;

  const {
    habit,
    isTodayDone,
    streak,
    longestStreak,
    totalCompletions,
    completionRate,
    habitDays,
    toggleDay,
    toggleToday,
    weeklyTrend,
    deleteHabit,
  } = useHabitDetail(habitId);

  if (!habit) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Habit not found</Text>
          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backHomeButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const habitColor = habit.color ?? Colors.tint;

  const getMotivationMessage = () => {
    if (streak >= 14) {
      return {
        badge: 'Unstoppable 🚀',
        message: 'Two weeks straight! Your discipline has turned into a solid lifestyle routine.',
      };
    }
    if (streak >= 7) {
      return {
        badge: 'On Fire! 🔥',
        message: "You've crushed a whole week! Keep this incredible momentum going.",
      };
    }
    if (streak >= 3) {
      return {
        badge: 'Great Momentum ⚡',
        message: `${streak} days in a row! You're building lasting consistency.`,
      };
    }
    if (streak === 1) {
      return {
        badge: 'Day 1 Down! 🌱',
        message: "The hardest part is starting. You're on your way!",
      };
    }
    return {
      badge: 'Fresh Start 💪',
      message: 'Consistency starts with one check-in. Complete today to start a streak!',
    };
  };

  const motivation = getMotivationMessage();

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.title}"? This will remove all associated completion records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit();
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navBarButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="chevron-left" size={16} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.navBarTitle} numberOfLines={1}>
          Habit Details
        </Text>

        <TouchableOpacity
          style={styles.navBarDeleteButton}
          onPress={handleDeletePress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="trash-o" size={16} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        <View style={[styles.heroCard, { borderTopColor: habitColor }]}>
          <View style={styles.heroTop}>
            <View style={[styles.heroIconBox, { backgroundColor: `${habitColor}18` }]}>
              <FontAwesome name="check-circle" size={26} color={habitColor} />
            </View>
            <View style={styles.heroTitles}>
              <Text style={styles.habitTitle}>{habit.title}</Text>
              {habit.description ? (
                <Text style={styles.habitSubtitle}>{habit.description}</Text>
              ) : null}
            </View>
          </View>

          {/* Today Action Button */}
          <TouchableOpacity
            style={[
              styles.todayActionButton,
              isTodayDone
                ? [styles.todayActionDone, { backgroundColor: habitColor }]
                : styles.todayActionPending,
            ]}
            onPress={toggleToday}
            activeOpacity={0.8}
          >
            <FontAwesome
              name={isTodayDone ? 'check-circle' : 'circle-o'}
              size={18}
              color={isTodayDone ? '#ffffff' : Colors.text}
            />
            <Text
              style={[
                styles.todayActionText,
                isTodayDone && styles.todayActionTextDone,
              ]}
            >
              {isTodayDone ? 'Completed Today ✓ (Tap to undo)' : 'Mark as Done for Today'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Trend Snapshot */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyRow}>
              {weeklyTrend.map((day) => {
                const isDone = day.isDone;
                const isCurToday = day.isToday;
                const isFuture = day.isFuture;

                return (
                  <TouchableOpacity
                    key={day.dateKey}
                    style={styles.weekDayCol}
                    disabled={isFuture}
                    onPress={() => toggleDay(day.dateKey)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.weekDayLabel,
                        isCurToday && { color: habitColor, fontWeight: '700' },
                      ]}
                    >
                      {day.dayName}
                    </Text>

                    <View
                      style={[
                        styles.weekDayCircle,
                        isDone && [styles.weekDayCircleDone, { backgroundColor: habitColor }],
                        isCurToday && !isDone && [styles.weekDayCircleToday, { borderColor: habitColor }],
                        isFuture && styles.weekDayCircleFuture,
                      ]}
                    >
                      {isDone ? (
                        <FontAwesome name="check" size={11} color="#ffffff" />
                      ) : (
                        <Text
                          style={[
                            styles.weekDayNumber,
                            isCurToday && { color: habitColor, fontWeight: '700' },
                            isFuture && styles.weekDayNumberFuture,
                          ]}
                        >
                          {day.dayNumber}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Habit Metrics & Streaks */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <HabitStats
            currentStreak={streak}
            longestStreak={longestStreak}
            totalCompletions={totalCompletions}
            completionRate={completionRate}
            habitColor={habitColor}
          />
        </View>

        {/* Interactive Monthly Calendar */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Completion Calendar</Text>
          <HabitMonthlyCalendar
            habitId={habit.id}
            habitDays={habitDays}
            habitColor={habitColor}
            onDayPress={toggleDay}
          />
        </View>

        {/* Motivation & Consistency Insights */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.badgePill, { backgroundColor: `${habitColor}20` }]}>
                <Text style={[styles.badgeText, { color: habitColor }]}>
                  {motivation.badge}
                </Text>
              </View>
            </View>
            <Text style={styles.insightMessage}>{motivation.message}</Text>

            <View style={styles.insightDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Frequency</Text>
                <Text style={styles.infoValue}>Daily</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Completion Target</Text>
                <Text style={styles.infoValue}>100%</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Reminders</Text>
                <Text style={styles.infoValue}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navBarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  navBarDeleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  heroIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitles: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  habitSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  todayActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
  },
  todayActionPending: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  todayActionDone: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  todayActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  todayActionTextDone: {
    color: '#ffffff',
  },
  sectionContainer: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weeklyCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weekDayCol: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  weekDayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  weekDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weekDayCircleDone: {
    borderWidth: 0,
  },
  weekDayCircleToday: {
    borderWidth: 1.5,
  },
  weekDayCircleFuture: {
    opacity: 0.35,
  },
  weekDayNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  weekDayNumberFuture: {
    color: Colors.textSecondary,
  },
  insightsCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  insightMessage: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 12,
  },
  insightDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  backHomeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.tint,
  },
  backHomeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
