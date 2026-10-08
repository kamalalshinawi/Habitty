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

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { resetPassword, isLoading, error, clearAuthError } = useAuth();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleReset = async () => {
    if (!email.trim()) {
      setValidationError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setValidationError('');
    const res = await resetPassword(email);
    if (res.success) {
      setIsSent(true);
    } else if (res.error) {
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
        {/* Top App Bar */}
        <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <FontAwesome name="chevron-left" size={14} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.navBarTitle, { color: colors.text }]}>Reset Password</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoCircle, { backgroundColor: `${colors.tint}18` }]}>
              <FontAwesome name="key" size={36} color={colors.tint} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              No worries! Enter the email associated with your account and we’ll send you instructions to reset your password.
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Success Banner */}
            {isSent ? (
              <View style={[styles.successBanner, { backgroundColor: `${colors.success}15`, borderColor: `${colors.success}40` }]}>
                <FontAwesome name="check-circle" size={20} color={colors.success} />
                <View style={styles.successTextContainer}>
                  <Text style={[styles.successTitle, { color: colors.success }]}>
                    Reset link sent!
                  </Text>
                  <Text style={[styles.successSubtitle, { color: colors.text }]}>
                    Check your email inbox at <Text style={{ fontFamily: Fonts.bold }}>{email}</Text> for instructions.
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Error Banner */}
            {activeError ? (
              <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}15`, borderColor: `${colors.danger}40` }]}>
                <FontAwesome name="exclamation-circle" size={16} color={colors.danger} />
                <Text style={[styles.errorBannerText, { color: colors.danger }]}>
                  {activeError}
                </Text>
              </View>
            ) : null}

            {/* Email Field */}
            {!isSent ? (
              <>
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
                      autoFocus={true}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: colors.tint },
                    isLoading && { opacity: 0.7 },
                  ]}
                  onPress={handleReset}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Send Reset Link</Text>
                      <FontAwesome name="paper-plane-o" size={14} color="#ffffff" />
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.tint }]}
                onPress={() => navigation.navigate('SignIn' as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Return to Sign In</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Link */}
          {!isSent ? (
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Remember your password?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.footerLink, { color: colors.tint }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : null}
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  navBarTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
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
    fontSize: 24,
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
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  successTextContainer: {
    flex: 1,
    gap: 4,
  },
  successTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  successSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
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
    height: 50,
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
    marginTop: 6,
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
    marginTop: 24,
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
