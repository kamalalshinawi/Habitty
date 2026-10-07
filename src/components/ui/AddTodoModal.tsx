import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

  const resetForm = () => {
    setTitle('');
    setPriority('medium');
    setSelectedTime(TIME_PRESETS[1]);
    setCustomTime('');
    setUseCustomTime(false);
    setSubtasks([]);
    setNewSubtaskInput('');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

    resetForm();
    onClose();
  };

  const isTitleValid = title.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* Top Navigation Bar */}
          <View style={[styles.navBar, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.navBarButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>

            <Text style={[styles.navBarTitle, { color: colors.text }]}>New Task</Text>

            <TouchableOpacity
              onPress={handleSave}
              disabled={!isTitleValid}
              style={[
                styles.saveHeaderButton,
                { backgroundColor: isTitleValid ? colors.tint : colors.border },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={[
                  styles.saveHeaderButtonText,
                  !isTitleValid && { color: colors.textSecondary },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Form Body */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title Input Card */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.inputHeaderRow}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Task Name *</Text>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: colors.background, color: colors.text, borderColor: errorMessage ? '#ef4444' : colors.border },
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
            </View>

            {/* Priority Selector Card */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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

            {/* Scheduled Time Card */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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

            {/* Subtasks Builder Card */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.labelRow}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Subtasks ({subtasks.length})
                </Text>
                <Text style={[styles.subtaskHint, { color: colors.textSecondary }]}>
                  Optional steps
                </Text>
              </View>

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
          </ScrollView>

          {/* Fixed Pinned Bottom Action Bar - Never requires scrolling */}
          <View style={[styles.bottomActionBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.createTaskBtn,
                { backgroundColor: isTitleValid ? colors.tint : colors.border },
              ]}
              onPress={handleSave}
              disabled={!isTitleValid}
              activeOpacity={0.8}
            >
              <FontAwesome
                name="plus-circle"
                size={18}
                color={isTitleValid ? '#ffffff' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.createTaskBtnText,
                  !isTitleValid && { color: colors.textSecondary },
                ]}
              >
                Create Task
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  navBarButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  navBarTitle: {
    fontSize: 17,
    fontFamily: Fonts.bold,
  },
  saveHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  saveHeaderButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  inputHeaderRow: {
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: Fonts.medium,
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
    gap: 8,
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
  bottomActionBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  createTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  createTaskBtnText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
});
