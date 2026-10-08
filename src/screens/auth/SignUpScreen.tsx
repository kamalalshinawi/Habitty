import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Fonts } from '../../constants/fonts';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { signUp, isLoading, error, clearAuthError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validate = () => {
    if (!name.trim()) {
      setValidationError('Please enter your name.');
      return false;
    }
    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    const res = await signUp(email, password, name);
    if (!res.success && res.error) {
      setValidationError(res.error);
    }
  };

  const activeError = validationError || error;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoCircle, { backgroundColor: `${colors.tint}18` }]}>
              <FontAwesome name="user-plus" size={36} color={colors.tint} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Start tracking your habits, achieving your daily goals, and syncing seamlessly.
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Error Banner */}
            {activeError ? (
              <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}15`, borderColor: `${colors.danger}40` }]}>
                <FontAwesome name="exclamation-circle" size={16} color={colors.danger} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.errorBannerText, { color: colors.danger }]}>
                    {activeError}
                  </Text>
                  {activeError.includes('already registered') ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('SignIn')}
                      style={{ marginTop: 6 }}
                    >
                      <Text style={{ color: colors.tint, fontFamily: Fonts.bold, fontSize: 13 }}>
                        Sign in to your existing account →
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <FontAwesome name="user-o" size={16} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Kamal Alshinawi"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (validationError) setValidationError('');
                    if (error) clearAuthError();
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <FontAwesome name="envelope-o" size={16} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (validationError) setValidationError('');
                    if (error) clearAuthError();
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <FontAwesome name="lock" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (validationError) setValidationError('');
                    if (error) clearAuthError();
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <FontAwesome name="check-square-o" size={17} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Repeat your password"
                  placeholderTextColor={colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (validationError) setValidationError('');
                    if (error) clearAuthError();
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <FontAwesome
                    name={showConfirmPassword ? 'eye-slash' : 'eye'}
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.tint },
                isLoading && { opacity: 0.7 },
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Create Account</Text>
                  <FontAwesome name="check" size={14} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn' as any)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.footerLink, { color: colors.tint }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.extraBold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    marginTop: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
});
