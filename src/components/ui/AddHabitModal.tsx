import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';
import type { Habit } from '../../types/habit';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddHabit: (habit: Habit) => void;
};

const COLOR_OPTIONS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#f43f5e',
  '#6366f1',
  '#14b8a8',
  '#8b5cf6',
  '#f97316',
];

const PRESETS = [
  { emoji: '💧', title: 'Drink Water', description: '8 glasses a day', color: '#3b82f6' },
  { emoji: '🏃', title: 'Morning Run', description: '30 min exercise', color: '#22c55e' },
  { emoji: '📚', title: 'Read Book', description: '20 pages daily', color: '#f59e0b' },
  { emoji: '🧘', title: 'Meditation', description: '10 min mindfulness', color: '#8b5cf6' },
  { emoji: '🌙', title: 'Sleep Early', description: '8 hours of rest', color: '#6366f1' },
  { emoji: '🥗', title: 'Healthy Diet', description: 'Clean eating & veggies', color: '#14b8a8' },
  { emoji: '💪', title: 'Daily Workout', description: 'Strength & stretching', color: '#f43f5e' },
  { emoji: '✍️', title: 'Journaling', description: 'Reflect on the day', color: '#f97316' },
];

export default function AddHabitModal({ visible, onClose, onAddHabit }: Props) {
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setSelectedColor(preset.color);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setSelectedColor(COLOR_OPTIONS[0]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newHabit: Habit = {
      id: `habit_${Date.now()}`,
      title: trimmedTitle,
      description: description.trim() || undefined,
      color: selectedColor,
    };

    onAddHabit(newHabit);
    handleReset();
    onClose();
  };

  const isSubmitDisabled = !title.trim();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.sheetContainer}
            >
              <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {/* Drag / Top indicator */}
                <View style={styles.indicatorContainer}>
                  <View style={[styles.indicator, { backgroundColor: colors.border }]} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                  <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>New Habit</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                      Create a daily routine to build consistency
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.background }]}
                    onPress={handleClose}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <FontAwesome name="times" size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Quick Inspiration Presets */}
                  <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>QUICK PRESETS</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.presetsRow}
                    >
                      {PRESETS.map((preset) => (
                        <TouchableOpacity
                          key={preset.title}
                          style={[
                            styles.presetPill,
                            { backgroundColor: colors.background, borderColor: colors.border },
                            title === preset.title && [
                              styles.presetPillActive,
                              { borderColor: preset.color, backgroundColor: `${preset.color}15` },
                            ],
                          ]}
                          onPress={() => handleSelectPreset(preset)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                          <Text
                            style={[
                              styles.presetText,
                              { color: colors.text },
                              title === preset.title && { color: preset.color, fontFamily: Fonts.bold },
                            ]}
                          >
                            {preset.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Habit Title Input */}
                  <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>HABIT TITLE *</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[
                          styles.textInput,
                          { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        ]}
                        placeholder="e.g. Read 20 pages, 30 min workout"
                        placeholderTextColor={colors.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                        maxLength={50}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  {/* Description Input */}
                  <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                      DESCRIPTION / GOAL (OPTIONAL)
                    </Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[
                          styles.textInput,
                          { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        ]}
                        placeholder="e.g. Daily morning routine"
                        placeholderTextColor={colors.textSecondary}
                        value={description}
                        onChangeText={setDescription}
                        maxLength={80}
                        returnKeyType="done"
                      />
                    </View>
                  </View>

                  {/* Color Palette */}
                  <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>COLOR THEME</Text>
                    <View style={styles.colorsGrid}>
                      {COLOR_OPTIONS.map((color) => {
                        const isSelected = selectedColor === color;
                        return (
                          <TouchableOpacity
                            key={color}
                            style={[
                              styles.colorCircle,
                              { backgroundColor: color },
                              isSelected && styles.colorCircleActive,
                            ]}
                            onPress={() => setSelectedColor(color)}
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
                </ScrollView>

                {/* Footer Action Buttons */}
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: isSubmitDisabled ? colors.border : selectedColor },
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled}
                    activeOpacity={0.8}
                  >
                    <FontAwesome name="plus" size={13} color="#ffffff" style={styles.submitIcon} />
                    <Text
                      style={[
                        styles.submitButtonText,
                        isSubmitDisabled && { color: colors.textSecondary },
                      ]}
                    >
                      Create Habit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 12,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  indicator: {
    width: 38,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.extraBold,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  presetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  presetPillActive: {
    borderWidth: 1.5,
  },
  presetEmoji: {
    fontSize: 14,
  },
  presetText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  inputWrapper: {
    width: '100%',
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  colorsGrid: {
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
  colorCircleActive: {
    transform: [{ scale: 1.15 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  submitButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  submitIcon: {
    marginRight: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
});
