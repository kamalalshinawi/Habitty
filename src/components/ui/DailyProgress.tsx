import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';

type Props = {
  completed: number;
  total: number;
};

export default function DailyProgress({ completed, total }: Props) {
  const { colors } = useTheme();

  const progress = total > 0 ? completed / total : 0;
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Today</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {completed} of {total} habits completed
        </Text>
      </View>

      <View style={[styles.progressBarContainer, { backgroundColor: colors.cardSecondary }]}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: colors.success }]}
        />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <FontAwesome name="check-circle" size={18} color={colors.success} />
          <Text style={[styles.statText, { color: colors.text }]}>{completed} Done</Text>
        </View>
        <View style={styles.stat}>
          <FontAwesome name="clock-o" size={18} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {total - completed} Remaining
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
  },
});
