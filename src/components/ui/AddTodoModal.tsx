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
import type { TodoPriority } from '../../types/todo';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddTodo: (params: {
    title: string;
    priority: TodoPriority;
    time?: string;
    subtasks?: string[];
  }) => void;
};

const PRIORITIES: { key: TodoPriority; label: string; color: string; icon: string }[] = [
  { key: 'high', label: 'High', color: '#ef4444', icon: 'exclamation-circle' },
  { key: 'medium', label: 'Medium', color: '#f59e0b', icon: 'clock-o' },
  { key: 'low', label: 'Low', color: '#3b82f6', icon: 'arrow-down' },
];

const TIME_PRESETS = [
  '08:00 AM',
  '10:00 AM',
  '02:00 PM',
  '06:00 PM',
  '09:00 PM',
  'All Day',
];

export default function AddTodoModal({ visible, onClose, onAddTodo }: Props) {
  const { colors, isDark } = useTheme();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [selectedTime, setSelectedTime] = useState(TIME_PRESETS[1]);
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddSubtask = () => {
    const trimmed = newSubtaskInput.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [...prev, trimmed]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Please enter a task title');
      return;
    }

    const finalTime = useCustomTime ? customTime.trim() : selectedTime;

    onAddTodo({
      title: trimmedTitle,
      priority,
      time: finalTime || undefined,
      subtasks,
    });

    // Reset form
    setTitle('');
    setPriority('medium');
    setSelectedTime(TIME_PRESETS[1]);
    setCustomTime('');
    setUseCustomTime(false);
    setSubtasks([]);
    setNewSubtaskInput('');
    setErrorMessage('');
    onClose();
  };

  const isTitleValid = title.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardView}
            >
              <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {/* Header Drag / Title */}
                <View style={styles.header}>
                  <View style={[styles.dragIndicator, { backgroundColor: colors.border }]} />
                  <View style={styles.headerRow}>
                    <Text style={[styles.sheetTitle, { color: colors.text }]}>New Task</Text>
                    <TouchableOpacity
                      onPress={onClose}
                      style={[styles.closeButton, { backgroundColor: colors.background }]}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <FontAwesome name="times" size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Title Input */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Task Name *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        errorMessage ? styles.textInputError : undefined,
                      ]}
                      placeholder="e.g. Plan sprint meeting, Pay bills"
                      placeholderTextColor={colors.textSecondary}
                      value={title}
                      onChangeText={(text) => {
                        setTitle(text);
                        if (errorMessage) setErrorMessage('');
                      }}
                      returnKeyType="next"
                    />
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                  </View>

                  {/* Priority Selector */}
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Priority</Text>
                    <View style={styles.priorityRow}>
                      {PRIORITIES.map((p) => {
                        const isSelected = priority === p.key;
                        return (
                          <TouchableOpacity
                            key={p.key}
                            style={[
                              styles.priorityChip,
                              { backgroundColor: colors.background, borderColor: colors.border },
                              isSelected && {
                                borderColor: p.color,
                                backgroundColor: isDark ? `${p.color}25` : `${p.color}15`,
                                borderWidth: 1.5,
                              },
                            ]}
                            onPress={() => setPriority(p.key)}
                            activeOpacity={0.7}
                          >
                            <FontAwesome
                              name={p.icon as any}
                              size={13}
                              color={isSelected ? p.color : colors.textSecondary}
                            />
                            <Text
                              style={[
                                styles.priorityChipText,
                                { color: isSelected ? p.color : colors.textSecondary },
                                isSelected && { fontFamily: Fonts.bold },
                              ]}
                            >
                              {p.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Time Option */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.inputLabel, { color: colors.text }]}>Scheduled Time</Text>
                      <TouchableOpacity
                        onPress={() => setUseCustomTime(!useCustomTime)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Text style={[styles.customToggleText, { color: colors.tint }]}>
                          {useCustomTime ? 'Use presets' : 'Custom time'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {useCustomTime ? (
                      <TextInput
                        style={[
                          styles.textInput,
                          { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        ]}
                        placeholder="e.g. 10:45 AM or Afternoon"
                        placeholderTextColor={colors.textSecondary}
                        value={customTime}
                        onChangeText={setCustomTime}
                      />
                    ) : (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsRow}>
                        {TIME_PRESETS.map((t) => {
                          const isSelected = selectedTime === t;
                          return (
                            <TouchableOpacity
                              key={t}
                              style={[
                                styles.timeChip,
                                { backgroundColor: colors.background, borderColor: colors.border },
                                isSelected && { borderColor: colors.tint, backgroundColor: `${colors.tint}15`, borderWidth: 1.5 },
                              ]}
                              onPress={() => setSelectedTime(t)}
                              activeOpacity={0.7}
                            >
                              <FontAwesome
                                name="clock-o"
                                size={12}
                                color={isSelected ? colors.tint : colors.textSecondary}
                              />
                              <Text
                                style={[
                                  styles.timeChipText,
                                  { color: isSelected ? colors.tint : colors.textSecondary },
                                  isSelected && { fontFamily: Fonts.bold },
                                ]}
                              >
                                {t}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>

                  {/* Subtasks Builder */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.inputLabel, { color: colors.text }]}>
                        Subtasks ({subtasks.length})
                      </Text>
                      <Text style={[styles.subtaskHint, { color: colors.textSecondary }]}>
                        Optional steps
                      </Text>
                    </View>

                    {/* Subtask list */}
                    {subtasks.length > 0 && (
                      <View style={styles.subtasksList}>
                        {subtasks.map((st, index) => (
                          <View
                            key={index}
                            style={[
                              styles.subtaskItem,
                              { backgroundColor: colors.background, borderColor: colors.border },
                            ]}
                          >
                            <FontAwesome name="circle-o" size={13} color={colors.textSecondary} />
                            <Text style={[styles.subtaskItemText, { color: colors.text }]} numberOfLines={1}>
                              {st}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleRemoveSubtask(index)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <FontAwesome name="times" size={13} color={colors.danger} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Add subtask input row */}
                    <View style={styles.addSubtaskRow}>
                      <TextInput
                        style={[
                          styles.subtaskInput,
                          { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        ]}
                        placeholder="Add a step / subtask..."
                        placeholderTextColor={colors.textSecondary}
                        value={newSubtaskInput}
                        onChangeText={setNewSubtaskInput}
                        onSubmitEditing={handleAddSubtask}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        style={[
                          styles.addSubtaskBtn,
                          { backgroundColor: newSubtaskInput.trim() ? colors.tint : colors.border },
                        ]}
                        onPress={handleAddSubtask}
                        disabled={!newSubtaskInput.trim()}
                        activeOpacity={0.7}
                      >
                        <FontAwesome name="plus" size={13} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Save Action CTA */}
                  <View style={styles.ctaContainer}>
                    <TouchableOpacity
                      style={[
                        styles.saveBtn,
                        { backgroundColor: isTitleValid ? colors.tint : colors.border },
                      ]}
                      onPress={handleSave}
                      disabled={!isTitleValid}
                      activeOpacity={0.8}
                    >
                      <FontAwesome name="check" size={15} color="#ffffff" />
                      <Text style={styles.saveBtnText}>Create Task</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
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
  keyboardView: {
    width: '100%',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 12,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 18,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  customToggleText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  subtaskHint: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  textInputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: Fonts.medium,
    marginLeft: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  priorityChipText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
  },
  presetsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  timeChipText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  subtasksList: {
    gap: 6,
    marginBottom: 4,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  subtaskItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    gap: 8,
  },
  subtaskInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  addSubtaskBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaContainer: {
    marginTop: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
});
