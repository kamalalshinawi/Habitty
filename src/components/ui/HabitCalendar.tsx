import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import type { CalendarDay } from '../../types/habit';

type Props = {
  days: CalendarDay[];
  onDayPress: (day: CalendarDay) => void;
};

export default function HabitCalendar({ days, onDayPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <Text key={d} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day) => (
          <TouchableOpacity
            key={day.dateString}
            style={[styles.dayCell, dayStatusStyle(day.status)]}
            onPress={() => onDayPress(day)}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
}

function dayStatusStyle(status: string) {
  switch (status) {
    case 'done':
      return { backgroundColor: Colors.success, opacity: 1 };
    case 'missed':
      return { backgroundColor: Colors.danger, opacity: 0.7 };
    default:
      return { backgroundColor: Colors.border, opacity: 0.4 };
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekday: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    width: 36,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 6,
    margin: 2,
  },
});
