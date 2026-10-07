import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';

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
  cardBg: string;
  borderColor: string;
  textColor: string;
  textSecondaryColor: string;
};

function StatCard({
  icon,
  iconColor,
  bgColor,
  value,
  label,
  subtitle,
  cardBg,
  borderColor,
  textColor,
  textSecondaryColor,
}: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.cardTop}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <FontAwesome name={icon as any} size={15} color={iconColor} />
        </View>
        <Text style={[styles.cardValue, { color: textColor }]}>{value}</Text>
      </View>
      <Text style={[styles.cardLabel, { color: textColor }]}>{label}</Text>
      <Text style={[styles.cardSubtitle, { color: textSecondaryColor }]}>{subtitle}</Text>
    </View>
  );
}

export default function HabitStats({
  streak,
  currentStreak,
  longestStreak,
  totalCompletions,
  completionRate = 0,
  habitColor,
}: Props) {
  const { colors, isDark } = useTheme();
  const activeStreak = currentStreak !== undefined ? currentStreak : (streak ?? 0);
  const ratePercent = Math.round(completionRate * 100);
  const tintColor = habitColor ?? colors.tint;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard
          icon="fire"
          iconColor="#f97316"
          bgColor={isDark ? '#431407' : '#ffedd5'}
          value={`${activeStreak}d`}
          label="Current Streak"
          subtitle={activeStreak > 0 ? "You're on fire! 🔥" : 'Start today!'}
          cardBg={colors.card}
          borderColor={colors.border}
          textColor={colors.text}
          textSecondaryColor={colors.textSecondary}
        />
        <StatCard
          icon="trophy"
          iconColor="#eab308"
          bgColor={isDark ? '#422006' : '#fef9c3'}
          value={`${longestStreak}d`}
          label="Longest Streak"
          subtitle="All-time personal best"
          cardBg={colors.card}
          borderColor={colors.border}
          textColor={colors.text}
          textSecondaryColor={colors.textSecondary}
        />
      </View>

      <View style={styles.row}>
        <StatCard
          icon="check-circle"
          iconColor="#22c55e"
          bgColor={isDark ? '#052e16' : '#dcfce7'}
          value={`${totalCompletions}`}
          label="Total Done"
          subtitle="Lifetime check-ins"
          cardBg={colors.card}
          borderColor={colors.border}
          textColor={colors.text}
          textSecondaryColor={colors.textSecondary}
        />
        <StatCard
          icon="pie-chart"
          iconColor={tintColor}
          bgColor={isDark ? `${tintColor}25` : `${tintColor}15`}
          value={`${ratePercent}%`}
          label="Consistency"
          subtitle="Completion rate"
          cardBg={colors.card}
          borderColor={colors.border}
          textColor={colors.text}
          textSecondaryColor={colors.textSecondary}
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
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
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
    fontFamily: Fonts.extraBold,
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.medium,
  },
});
