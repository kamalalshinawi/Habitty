import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { MONTH_NAMES, formatDateKey, getCalendarGridDays } from '../../utils/dateHelpers';
import type { HabitStatus } from '../../types/habit';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  habitId: string;
  habitDays: Record<string, HabitStatus>;
  habitColor?: string;
  onDayPress?: (dateKey: string) => void;
};

const WEEKDAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HabitMonthlyCalendar({
  habitId,
  habitDays,
  habitColor = Colors.tint,
  onDayPress,
}: Props) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const isCurrentViewingMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleResetToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const gridDays = getCalendarGridDays(currentYear, currentMonth);

  // Calculate monthly stats for the displayed month
  const daysInThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let completedInMonth = 0;
  for (let d = 1; d <= daysInThisMonth; d++) {
    const testDate = new Date(currentYear, currentMonth, d);
    const key = formatDateKey(testDate);
    if (habitDays[`${key}-${habitId}`] === 'done') {
      completedInMonth++;
    }
  }

  // Calculate days passed up to today if viewing current month, or all days if viewing past month
  const countableDays = isCurrentViewingMonth
    ? today.getDate()
    : currentYear < today.getFullYear() || (currentYear === today.getFullYear() && currentMonth < today.getMonth())
    ? daysInThisMonth
    : 0;

  const monthlyRate = countableDays > 0 ? Math.round((completedInMonth / countableDays) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Month Navigation Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.monthTitle}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </Text>
          <Text style={styles.monthSubtitle}>
            {completedInMonth} of {countableDays} days completed ({monthlyRate}%)
          </Text>
        </View>

        <View style={styles.navButtons}>
          {!isCurrentViewingMonth && (
            <TouchableOpacity
              style={styles.todayButton}
              onPress={handleResetToToday}
              activeOpacity={0.7}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevMonth}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesome name="chevron-left" size={13} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextMonth}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesome name="chevron-right" size={13} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday Row */}
      <View style={styles.weekdayRow}>
        {WEEKDAY_HEADERS.map((day, idx) => (
          <Text key={idx} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.grid}>
        {gridDays.map((cell, index) => {
          const isDone = habitDays[`${cell.dateKey}-${habitId}`] === 'done';
          const isTodayDate = cell.isToday;
          const isFuture = cell.isFuture;
          const isCurrentMonth = cell.isCurrentMonth;

          return (
            <View key={`${cell.dateKey}-${index}`} style={styles.cellWrapper}>
              <TouchableOpacity
                style={[
                  styles.dayCell,
                  !isCurrentMonth && styles.dayCellOutOfMonth,
                  isTodayDate && styles.dayCellToday,
                  isDone && [styles.dayCellDone, { backgroundColor: habitColor, borderColor: habitColor }],
                  isFuture && styles.dayCellFuture,
                ]}
                disabled={isFuture}
                onPress={() => onDayPress?.(cell.dateKey)}
                activeOpacity={0.7}
              >
                {isDone ? (
                  <FontAwesome name="check" size={13} color="#ffffff" />
                ) : (
                  <Text
                    style={[
                      styles.dayNumber,
                      !isCurrentMonth && styles.dayNumberOutOfMonth,
                      isTodayDate && { color: habitColor, fontWeight: '700' },
                      isFuture && styles.dayNumberFuture,
                    ]}
                  >
                    {cell.date.getDate()}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Legend & Hint */}
      <View style={styles.footer}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: habitColor }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendTodayDot, { borderColor: habitColor }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendPendingDot]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
        </View>
        <Text style={styles.hintText}>Tap any day to toggle your status</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  monthSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.border,
    marginRight: 4,
  },
  todayButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  weekdayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cellWrapper: {
    width: '14.28%',
    alignItems: 'center',
    marginVertical: 3,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayCellOutOfMonth: {
    opacity: 0.35,
  },
  dayCellToday: {
    borderColor: Colors.tint,
    borderWidth: 1.5,
  },
  dayCellDone: {
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  dayCellFuture: {
    opacity: 0.4,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  dayNumberOutOfMonth: {
    color: Colors.textSecondary,
  },
  dayNumberFuture: {
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
    gap: 8,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendTodayDot: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  legendPendingDot: {
    backgroundColor: Colors.border,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
