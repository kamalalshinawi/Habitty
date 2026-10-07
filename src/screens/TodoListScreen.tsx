import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import { useTodos } from '../features/todos/context/TodoContext';
import { Fonts } from '../constants/fonts';
import AddTodoModal from '../components/ui/AddTodoModal';
import type { Todo, TodoPriority } from '../types/todo';

const PRIORITY_CONFIG: Record<
  TodoPriority,
  { label: string; color: string; bgLight: string; bgDark: string }
> = {
  high: { label: 'High', color: '#ef4444', bgLight: '#fee2e2', bgDark: '#450a0a' },
  medium: { label: 'Medium', color: '#f59e0b', bgLight: '#fef3c7', bgDark: '#451a03' },
  low: { label: 'Low', color: '#3b82f6', bgLight: '#dbeafe', bgDark: '#172554' },
};

export default function TodoListScreen() {
  const { colors, isDark } = useTheme();
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleSubtask,
    pendingCount,
    completedCount,
  } = useTodos();

  const [selectedFilter, setSelectedFilter] = useState<'all' | TodoPriority>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedTodoIds, setExpandedTodoIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (todoId: string) => {
    setExpandedTodoIds((prev) => ({
      ...prev,
      [todoId]: !prev[todoId],
    }));
  };

  const filteredTodos = todos.filter((todo) => {
    if (selectedFilter === 'all') return true;
    return todo.priority === selectedFilter;
  });

  const pendingTodos = filteredTodos.filter((t) => !t.completed);
  const completedTodos = filteredTodos.filter((t) => t.completed);

  const renderTodoCard = (todo: Todo) => {
    const isExpanded = !!expandedTodoIds[todo.id];
    const priorityConfig = PRIORITY_CONFIG[todo.priority];
    const priorityBg = isDark ? priorityConfig.bgDark : priorityConfig.bgLight;

    const subtasksCount = todo.subtasks.length;
    const completedSubtasksCount = todo.subtasks.filter((s) => s.completed).length;

    return (
      <View
        key={todo.id}
        style={[
          styles.todoCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderLeftColor: priorityConfig.color,
          },
        ]}
      >
        <View style={styles.todoMainRow}>
          {/* Checkbox */}
          <TouchableOpacity
            style={[
              styles.checkbox,
              { borderColor: todo.completed ? colors.success : colors.border },
              todo.completed && { backgroundColor: colors.success },
            ]}
            onPress={() => toggleTodo(todo.id)}
            activeOpacity={0.7}
          >
            {todo.completed && <FontAwesome name="check" size={13} color="#ffffff" />}
          </TouchableOpacity>

          {/* Task Info */}
          <View style={styles.todoTextContainer}>
            <Text
              style={[
                styles.todoTitle,
                { color: colors.text },
                todo.completed && [styles.todoTitleCompleted, { color: colors.textSecondary }],
              ]}
              numberOfLines={2}
            >
              {todo.title}
            </Text>

            {/* Badges Row */}
            <View style={styles.badgesRow}>
              {/* Priority Badge */}
              <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
                <Text style={[styles.priorityBadgeText, { color: priorityConfig.color }]}>
                  {priorityConfig.label}
                </Text>
              </View>

              {/* Time Badge */}
              {todo.time ? (
                <View style={[styles.timeBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <FontAwesome name="clock-o" size={11} color={colors.textSecondary} />
                  <Text style={[styles.timeBadgeText, { color: colors.textSecondary }]}>
                    {todo.time}
                  </Text>
                </View>
              ) : null}

              {/* Subtasks Counter Pill */}
              {subtasksCount > 0 && (
                <TouchableOpacity
                  style={[
                    styles.subtasksPill,
                    { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                  onPress={() => toggleExpand(todo.id)}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="tasks" size={11} color={colors.tint} />
                  <Text style={[styles.subtasksPillText, { color: colors.tint }]}>
                    {completedSubtasksCount}/{subtasksCount}
                  </Text>
                  <FontAwesome
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={9}
                    color={colors.tint}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Delete Action */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteTodo(todo.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesome name="trash-o" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Expandable Subtasks Accordion */}
        {subtasksCount > 0 && isExpanded && (
          <View style={[styles.subtasksContainer, { borderTopColor: colors.border }]}>
            <Text style={[styles.subtasksHeaderTitle, { color: colors.textSecondary }]}>
              SUBTASKS ({completedSubtasksCount}/{subtasksCount})
            </Text>

            {todo.subtasks.map((st) => (
              <TouchableOpacity
                key={st.id}
                style={[styles.subtaskRow, { backgroundColor: colors.background }]}
                onPress={() => toggleSubtask(todo.id, st.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.subtaskCheckbox,
                    { borderColor: st.completed ? colors.success : colors.border },
                    st.completed && { backgroundColor: colors.success },
                  ]}
                >
                  {st.completed && <FontAwesome name="check" size={10} color="#ffffff" />}
                </View>

                <Text
                  style={[
                    styles.subtaskTitle,
                    { color: colors.text },
                    st.completed && [styles.subtaskTitleCompleted, { color: colors.textSecondary }],
                  ]}
                  numberOfLines={1}
                >
                  {st.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Tasks & To-Do</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {pendingCount} pending • {completedCount} completed
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.headerAddBtn, { backgroundColor: colors.tint }]}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <FontAwesome name="plus" size={13} color="#ffffff" />
          <Text style={styles.headerAddBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersRow}>
        {(['all', 'high', 'medium', 'low'] as const).map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                { backgroundColor: colors.card, borderColor: colors.border },
                isSelected && { borderColor: colors.tint, backgroundColor: `${colors.tint}18` },
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: isSelected ? colors.tint : colors.textSecondary },
                  isSelected && { fontFamily: Fonts.bold },
                ]}
              >
                {filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={pendingTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTodoCard(item)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: `${colors.tint}15` }]}>
              <FontAwesome name="check-circle" size={36} color={colors.tint} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>All tasks completed!</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {todos.length === 0
                ? 'Create a task to get started.'
                : 'Great job staying on top of your responsibilities.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            {/* Completed Tasks Accordion Bar */}
            {completedTodos.length > 0 && (
              <View style={styles.completedSection}>
                <TouchableOpacity
                  style={[
                    styles.completedBar,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setShowCompleted(!showCompleted)}
                  activeOpacity={0.7}
                >
                  <View style={styles.completedBarLeft}>
                    <FontAwesome name="check-circle" size={16} color={colors.success} />
                    <Text style={[styles.completedBarTitle, { color: colors.text }]}>
                      Completed ({completedTodos.length})
                    </Text>
                  </View>

                  <View style={styles.completedBarRight}>
                    <Text style={[styles.completedBarToggleText, { color: colors.textSecondary }]}>
                      {showCompleted ? 'Hide' : 'Show'}
                    </Text>
                    <FontAwesome
                      name={showCompleted ? 'chevron-up' : 'chevron-down'}
                      size={13}
                      color={colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>

                {/* Show Completed List when expanded */}
                {showCompleted && (
                  <View style={styles.completedList}>
                    {completedTodos.map((todo) => renderTodoCard(todo))}
                  </View>
                )}
              </View>
            )}

            <View style={{ height: 90 }} />
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={() => setIsAddModalOpen(true)}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={22} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <AddTodoModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTodo={addTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.extraBold,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  headerAddBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
  },
  todoCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginVertical: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  todoMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    lineHeight: 20,
    marginBottom: 6,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  timeBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
  },
  subtasksPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  subtasksPillText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
  },
  deleteBtn: {
    padding: 6,
  },
  subtasksContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 6,
  },
  subtasksHeaderTitle: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  subtaskCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  subtaskTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  footerContainer: {
    marginTop: 10,
  },
  completedSection: {
    marginTop: 10,
  },
  completedBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  completedBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completedBarTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  completedBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedBarToggleText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  completedList: {
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});