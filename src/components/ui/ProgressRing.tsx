import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';

type Props = {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
};

export default function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  label,
  sublabel,
}: Props) {
  const { colors } = useTheme();

  const clamped = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={colors.border}
          fill="transparent"
          strokeOpacity={0.4}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={colors.tint}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        {label ? <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text> : null}
        <Text style={[styles.value, { color: colors.text }]}>{Math.round(clamped * 100)}%</Text>
      </View>
      {sublabel ? (
        <Text style={[styles.sublabel, { color: colors.textSecondary }]}>{sublabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontFamily: Fonts.extraBold,
  },
  label: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    marginBottom: 2,
  },
  sublabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginTop: 4,
  },
});
