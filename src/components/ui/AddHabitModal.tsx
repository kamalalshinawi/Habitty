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
import { Colors } from '../../constants/colors';
import type { Habit } from '../../types/habit';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddHabit: (habit: Habit) => void;
};

const COLOR_OPTIONS = [
  Colors.habitColors.blue,
  Colors.habitColors.green,
  Colors.habitColors.amber,
  Colors.habitColors.rose,
  Colors.habitColors.indigo,
  Colors.habitColors.teal,
  Colors.habitColors.violet,
  Colors.habitColors.orange,
];

const PRESETS = [
  { emoji: '💧', title: 'Drink Water', description: '8 glasses a day', color: Colors.habitColors.blue },
  { emoji: '🏃', title: 'Morning Run', description: '30 min exercise', color: Colors.habitColors.green },
  { emoji: '📚', title: 'Read Book', description: '20 pages daily', color: Colors.habitColors.amber },
  { emoji: '🧘', title: 'Meditation', description: '10 min mindfulness', color: Colors.habitColors.violet },
  { emoji: '🌙', title: 'Sleep Early', description: '8 hours of rest', color: Colors.habitColors.indigo },
  { emoji: '🥗', title: 'Healthy Diet', description: 'Clean eating & veggies', color: Colors.habitColors.teal },
  { emoji: '💪', title: 'Daily Workout', description: 'Strength & stretching', color: Colors.habitColors.rose },
  { emoji: '✍️', title: 'Journaling', description: 'Reflect on the day', color: Colors.habitColors.orange },
];

export default function AddHabitModal({ visible, onClose, onAddHabit }: Props) {
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
              <View style={styles.sheet}>
                {/* Drag / Top indicator */}
                <View style={styles.indicatorContainer}>
                  <View style={styles.indicator} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                  <View>
                    <Text style={styles.headerTitle}>New Habit</Text>
                    <Text style={styles.headerSubtitle}>
                      Create a daily routine to build consistency
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <FontAwesome name="times" size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Quick Inspiration Presets */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Quick Presets</Text>
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
                            title === preset.title && [
                              styles.presetPillActive,
                              { borderColor: preset.color },
                            ],
                          ]}
                          onPress={() => handleSelectPreset(preset)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                          <Text style={styles.presetText}>{preset.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Habit Title Input */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Habit Title *</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., Morning Workout, Read 20 pages"
                        placeholderTextColor={Colors.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                        autoCapitalize="sentences"
                        maxLength={50}
                      />
                      {title.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setTitle('')}
                          style={styles.clearIcon}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <FontAwesome name="times-circle" size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Habit Description Input */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Description (Optional)</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 30 mins before breakfast"
                        placeholderTextColor={Colors.textSecondary}
                        value={description}
                        onChangeText={setDescription}
                        autoCapitalize="sentences"
                        maxLength={100}
                      />
                      {description.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setDescription('')}
                          style={styles.clearIcon}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <FontAwesome name="times-circle" size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Color Palette Selector */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Theme Color</Text>
                    <View style={styles.colorPalette}>
                      {COLOR_OPTIONS.map((color) => {
                        const isSelected = selectedColor === color;
                        return (
                          <TouchableOpacity
                            key={color}
                            style={[
                              styles.colorCircle,
                              { backgroundColor: color },
                              isSelected && styles.colorCircleSelected,
                            ]}
                            onPress={() => setSelectedColor(color)}
                            activeOpacity={0.8}
                          >
                            {isSelected && (
                              <FontAwesome name="check" size={14} color="#ffffff" />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: selectedColor },
                      isSubmitDisabled && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled}
                    activeOpacity={0.8}
                  >
                    <FontAwesome name="plus" size={14} color="#ffffff" style={styles.submitIcon} />
                    <Text style={styles.submitButtonText}>Create Habit</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  presetsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  presetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  presetPillActive: {
    backgroundColor: Colors.background,
  },
  presetEmoji: {
    fontSize: 14,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: Colors.text,
  },
  clearIcon: {
    padding: 4,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  submitButton: {
    flex: 2,
    height: 46,
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
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitIcon: {
    marginRight: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
