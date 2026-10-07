import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';

type Props = {
  onMenuPress?: () => void;
};

export default function HomeHeader({ onMenuPress }: Props) {
  const { colors, isDark, toggleTheme } = useTheme();

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.greeting, { color: colors.text }]}>Habi</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{dateString}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <FontAwesome
            name={isDark ? 'sun-o' : 'moon-o'}
            size={16}
            color={isDark ? '#f59e0b' : colors.textSecondary}
          />
        </TouchableOpacity>

        {onMenuPress && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <FontAwesome name="ellipsis-v" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greeting: {
    fontSize: 26,
    fontFamily: Fonts.extraBold,
  },
  date: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
