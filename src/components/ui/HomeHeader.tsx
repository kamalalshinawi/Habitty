import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  onMenuPress?: () => void;
};

export default function HomeHeader({ onMenuPress }: Props) {
  const today = new Date();
  const dateString = today.toLocaleDateString('enUS', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Habi</Text>
        <Text style={styles.date}>{dateString}</Text>
      </View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <FontAwesome name="ellipsis-v" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
