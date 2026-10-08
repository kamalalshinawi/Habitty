import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../features/habits/hooks/useHabits';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Fonts } from '../constants/fonts';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme, setThemeMode } = useTheme();
  const { habits, todayCompleted } = useHabits();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: `${colors.tint}20`, borderColor: colors.tint }]}>
            <FontAwesome name="user" size={36} color={colors.tint} />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.displayName || 'Habitty User'}
          </Text>
          <Text style={[styles.userSubtitle, { color: colors.textSecondary }]}>
            {user?.email || 'Building positive habits daily'}
          </Text>
        </View>

        {/* Quick Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.tint }]}>{habits.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Habits</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.success }]}>{todayCompleted}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Done Today</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>
              {habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completion</Text>
          </View>
        </View>

        {/* Appearance & Dark Mode Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? '#334155' : '#fef3c7' },
                  ]}
                >
                  <FontAwesome
                    name={isDark ? 'moon-o' : 'sun-o'}
                    size={18}
                    color={isDark ? '#93c5fd' : '#f59e0b'}
                  />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                  </Text>
                </View>
              </View>

              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Theme Selectors */}
            <View style={styles.themeSelectorRow}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  !isDark && { borderColor: colors.tint, borderWidth: 2 },
                ]}
                onPress={() => setThemeMode('light')}
                activeOpacity={0.7}
              >
                <FontAwesome name="sun-o" size={18} color={!isDark ? colors.tint : colors.textSecondary} />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: !isDark ? colors.tint : colors.textSecondary },
                    !isDark && { fontFamily: Fonts.bold },
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  isDark && { borderColor: colors.tint, borderWidth: 2 },
                ]}
                onPress={() => setThemeMode('dark')}
                activeOpacity={0.7}
              >
                <FontAwesome name="moon-o" size={18} color={isDark ? colors.tint : colors.textSecondary} />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: isDark ? colors.tint : colors.textSecondary },
                    isDark && { fontFamily: Fonts.bold },
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.tint}18` }]}>
                  <FontAwesome name="bell-o" size={16} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Daily Reminders</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    Get notifications to complete daily habits
                  </Text>
                </View>
              </View>

              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.success}18` }]}>
                  <FontAwesome name="font" size={15} color={colors.success} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Font Family</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    Nunito (Google Fonts)
                  </Text>
                </View>
              </View>
              <Text style={[styles.badgeValue, { color: colors.tint }]}>Active</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.tint}18` }]}>
                  <FontAwesome name="cloud" size={15} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Cloud Sync</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    Firebase Firestore active
                  </Text>
                </View>
              </View>
              <Text style={[styles.badgeValue, { color: colors.success }]}>Online</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.danger}18` }]}>
                  <FontAwesome name="sign-out" size={16} color={colors.danger} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.danger }]}>Sign Out</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    Log out of {user?.email || 'this device'}
                  </Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={13} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About App Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${colors.warning}18` }]}>
                  <FontAwesome name="info-circle" size={16} color={colors.warning} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Habi Tracker</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    Version 1.0.0
                  </Text>
                </View>
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
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: Fonts.extraBold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
  },
  badgeValue: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
});