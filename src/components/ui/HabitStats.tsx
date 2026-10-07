import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  streak?: number;
  currentStreak?: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate?: number;
  habitColor?: string;
};

type StatCardProps = {
  icon: string;
  iconColor: string;
  bgColor: string;
  value: string;
  label: string;
  subtitle: string;
};

function StatCard({ icon, iconColor, bgColor, value, label, subtitle }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <FontAwesome name={icon as any} size={16} color={iconColor} />
        </View>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );
}

export default function HabitStats({
  streak,
  currentStreak,
  longestStreak,
  totalCompletions,
  completionRate = 0,
  habitColor = Colors.tint,
}: Props) {
  const activeStreak = currentStreak !== undefined ? currentStreak : (streak ?? 0);
  const ratePercent = Math.round(completionRate * 100);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard
          icon="fire"
          iconColor="#f97316"
          bgColor="#ffedd5"
          value={`${activeStreak}d`}
          label="Current Streak"
          subtitle={activeStreak > 0 ? "You're on fire! 🔥" : "Start today!"}
        />
        <StatCard
          icon="trophy"
          iconColor="#eab308"
          bgColor="#fef9c3"
          value={`${longestStreak}d`}
          label="Longest Streak"
          subtitle="All-time personal best"
        />
      </View>

      <View style={styles.row}>
        <StatCard
          icon="check-circle"
          iconColor="#22c55e"
          bgColor="#dcfce7"
          value={`${totalCompletions}`}
          label="Total Done"
          subtitle="Lifetime check-ins"
        />
        <StatCard
          icon="pie-chart"
          iconColor={habitColor}
          bgColor="#eff6ff"
          value={`${ratePercent}%`}
          label="Consistency"
          subtitle="Completion rate"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
});
