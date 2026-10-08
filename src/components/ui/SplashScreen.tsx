import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';

interface SplashScreenProps {
  message?: string;
}

export default function SplashScreen({
  message = 'Starting Habitty...',
}: SplashScreenProps) {
  const { colors, isDark } = useTheme();

  // React 19 compliant animated state values
  const [logoScale] = useState(() => new Animated.Value(0.85));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [progressBarAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Subtle continuous pulsing logo glow
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 3. Smooth progress bar loop
    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progressBarAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(progressBarAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );
    progressLoop.start();

    return () => {
      pulseLoop.stop();
      progressLoop.stop();
    };
  }, [logoScale, logoOpacity, textOpacity, pulseAnim, progressBarAnim]);

  const progressWidth = progressBarAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['15%', '70%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Ambient Glow */}
      <View
        style={[
          styles.ambientGlow,
          {
            backgroundColor: `${colors.tint}12`,
          },
        ]}
      />

      {/* Centered Brand Content */}
      <View style={styles.centerContent}>
        {/* Animated App Icon */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
              shadowColor: colors.tint,
            },
          ]}
        >
          <Image
            source={require('../../../src/assets/appIcon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title & Tagline */}
        <Animated.View style={[styles.textWrapper, { opacity: textOpacity }]}>
          <Text style={[styles.appName, { color: colors.text }]}>Habitty</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Build Consistency • Transform Habits
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Loading Indicator */}
      <Animated.View style={[styles.bottomContainer, { opacity: textOpacity }]}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: isDark ? colors.cardSecondary : colors.border },
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: colors.tint,
              },
            ]}
          />
        </View>

        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  ambientGlow: {
    position: 'absolute',
    top: '30%',
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 104,
    height: 104,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 24,
  },
  textWrapper: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontFamily: Fonts.extraBold,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    letterSpacing: 0.2,
  },
  bottomContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
    gap: 12,
  },
  progressTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
});
