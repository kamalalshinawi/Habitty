import React, { useState } from 'react';
import {
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

import { Colors } from '../constants/colors';
import type { RootStackParamList } from '../navigation/types';
import { useHabits } from '../features/habits/hooks/useHabits';

type AddHabitNavProp = NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;

const COLOR_PALETTE = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Teal', hex: '#14b8a8' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Orange', hex: '#f97316' },
];

const ICON_OPTIONS = [
  { icon: 'check-circle', label: 'General' },
  { icon: 'tint', label: 'Health' },
  { icon: 'heartbeat', label: 'Fitness' },
  { icon: 'book', label: 'Learning' },
  { icon: 'smile-o', label: 'Mind' },
  { icon: 'star', label: 'Special' },
];

const FREQUENCIES = ['Every Day', 'Weekdays', 'Weekends'];

export default function AddHabitScreen() {
  const navigation = useNavigation<AddHabitNavProp>();
  const { addHabit } = useHabits();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].hex);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].icon);
  const [selectedFrequency, setSelectedFrequency] = useState(FREQUENCIES[0]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Please enter a habit title');
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      title: trimmedTitle,
      description: description.trim() || undefined,
      color: selectedColor,
      icon: selectedIcon,
      frequency: selectedFrequency,
      createdAt: new Date().toISOString(),
    };

    addHabit(newHabit);
    navigation.goBack();
  };

  const isTitleValid = title.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.navBarTitle}>New Habit</Text>

          <TouchableOpacity
            style={[
              styles.saveHeaderButton,
              { backgroundColor: isTitleValid ? selectedColor : Colors.border },
            ]}
            onPress={handleCreate}
            disabled={!isTitleValid}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.saveHeaderButtonText,
                !isTitleValid && styles.saveHeaderButtonDisabledText,
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Live Card Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
            <View style={[styles.previewCard, { borderLeftColor: selectedColor }]}>
              <View style={styles.previewCardContent}>
                <View style={[styles.previewIconCircle, { backgroundColor: `${selectedColor}18` }]}>
                  <FontAwesome name={selectedIcon as any} size={18} color={selectedColor} />
                </View>
                <View style={styles.previewTextContainer}>
                  <Text style={styles.previewCardTitle} numberOfLines={1}>
                    {title.trim() || 'Habit Name'}
                  </Text>
                  <Text style={styles.previewCardDesc} numberOfLines={1}>
                    {description.trim() || 'Description or daily target'}
                  </Text>
                  <View style={styles.previewStreak}>
                    <FontAwesome name="fire" size={12} color={Colors.warning} />
                    <Text style={styles.previewStreakText}>0 day streak • {selectedFrequency}</Text>
                  </View>
                </View>
                <View style={[styles.previewCheckbox, { borderColor: selectedColor }]} />
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>Title *</Text>
                <Text style={styles.charCounter}>{title.length}/40</Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  errorMessage ? styles.textInputError : undefined,
                ]}
                placeholder="e.g. Drink 2L water, Morning jog, Read"
                placeholderTextColor={Colors.textSecondary}
                value={title}
                maxLength={40}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMessage) setErrorMessage('');
                }}
                returnKeyType="next"
              />
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description / Goal (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 20 pages daily, 30 min cardio"
                placeholderTextColor={Colors.textSecondary}
                value={description}
                maxLength={60}
                onChangeText={setDescription}
                returnKeyType="done"
              />
            </View>

            {/* Color Palette Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Choose Color Theme</Text>
              <View style={styles.paletteRow}>
                {COLOR_PALETTE.map((color) => {
                  const isSelected = selectedColor === color.hex;
                  return (
                    <TouchableOpacity
                      key={color.hex}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color.hex },
                        isSelected && styles.colorCircleSelected,
                      ]}
                      onPress={() => setSelectedColor(color.hex)}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <FontAwesome name="check" size={13} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category / Icon Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Icon</Text>
              <View style={styles.iconGrid}>
                {ICON_OPTIONS.map((item) => {
                  const isSelected = selectedIcon === item.icon;
                  return (
                    <TouchableOpacity
                      key={item.icon}
                      style={[
                        styles.iconOption,
                        isSelected && [
                          styles.iconOptionSelected,
                          { borderColor: selectedColor, backgroundColor: `${selectedColor}12` },
                        ],
                      ]}
                      onPress={() => setSelectedIcon(item.icon)}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name={item.icon as any}
                        size={18}
                        color={isSelected ? selectedColor : Colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.iconOptionLabel,
                          isSelected && { color: selectedColor, fontWeight: '700' },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Frequency Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <View style={styles.frequencyRow}>
                {FREQUENCIES.map((freq) => {
                  const isSelected = selectedFrequency === freq;
                  return (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyChip,
                        isSelected && [
                          styles.frequencyChipSelected,
                          { borderColor: selectedColor, backgroundColor: `${selectedColor}12` },
                        ],
                      ]}
                      onPress={() => setSelectedFrequency(freq)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.frequencyChipText,
                          isSelected && { color: selectedColor, fontWeight: '700' },
                        ]}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Bottom Primary Action Button */}
          <View style={styles.bottomCtaContainer}>
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: isTitleValid ? selectedColor : Colors.border },
              ]}
              onPress={handleCreate}
              disabled={!isTitleValid}
              activeOpacity={0.8}
            >
              <FontAwesome
                name="plus-circle"
                size={18}
                color={isTitleValid ? '#ffffff' : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.createButtonText,
                  !isTitleValid && styles.createButtonDisabledText,
                ]}
              >
                Create Habit
              </Text>
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
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  navBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  saveHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
  },
  saveHeaderButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  saveHeaderButtonDisabledText: {
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  previewSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  previewCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  previewCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  previewCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  previewStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewStreakText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  previewCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginLeft: 8,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  charCounter: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  textInputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: -4,
    marginLeft: 4,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    transform: [{ scale: 1.15 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  iconOptionSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconOptionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  frequencyChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  frequencyChipSelected: {},
  frequencyChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  bottomCtaContainer: {
    paddingHorizontal: 16,
    marginTop: 28,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  createButtonDisabledText: {
    color: Colors.textSecondary,
  },
});
