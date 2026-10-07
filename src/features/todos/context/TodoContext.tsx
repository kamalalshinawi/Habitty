import React, { createContext, useContext, useState } from 'react';
import type { Todo, TodoPriority } from '../../../types/todo';

interface AddTodoParams {
  title: string;
  priority: TodoPriority;
  time?: string;
  subtasks?: string[];
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (params: AddTodoParams) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  addSubtask: (todoId: string, title: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  pendingCount: number;
  completedCount: number;
}

const INITIAL_TODOS: Todo[] = [
  {
    id: 't-1',
    title: 'Morning Workout & Stretching',
    completed: false,
    priority: 'high',
    time: '07:30 AM',
    subtasks: [
      { id: 's-1', title: '10 min warmup & dynamic stretch', completed: true },
      { id: 's-2', title: '30 min HIIT & core training', completed: false },
      { id: 's-3', title: 'Post-workout protein smoothie', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Review weekly project milestones',
    completed: false,
    priority: 'medium',
    time: '11:00 AM',
    subtasks: [
      { id: 's-4', title: 'Audit pull requests and reviews', completed: false },
      { id: 's-5', title: 'Update task sprint board', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Buy fresh groceries & meal prep',
    completed: false,
    priority: 'low',
    time: '05:00 PM',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Plan tomorrow’s priorities',
    completed: true,
    priority: 'medium',
    time: '08:30 PM',
    subtasks: [
      { id: 's-6', title: 'Review calendar commitments', completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-5',
    title: 'Drink 2 liters of water',
    completed: true,
    priority: 'low',
    time: 'All Day',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
];

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);

  const addTodo = ({ title, priority, time, subtasks = [] }: AddTodoParams) => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: title.trim(),
      completed: false,
      priority,
      time: time?.trim() || undefined,
      subtasks: subtasks
        .filter((s) => s.trim().length > 0)
        .map((s, idx) => ({
          id: `sub-${Date.now()}-${idx}`,
          title: s.trim(),
          completed: false,
        })),
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo;
        const newCompleted = !todo.completed;
        // When marking parent task as completed, mark all subtasks as completed
        // When uncompleting, keep existing subtask statuses
        return {
          ...todo,
          completed: newCompleted,
          subtasks: newCompleted
            ? todo.subtasks.map((s) => ({ ...s, completed: true }))
            : todo.subtasks,
        };
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId) return todo;
        const updatedSubtasks = todo.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        const allSubtasksDone =
          updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);

        return {
          ...todo,
          subtasks: updatedSubtasks,
          // If all subtasks completed, auto-complete parent task
          completed: allSubtasksDone ? true : todo.completed,
        };
      })
    );
  };

  const addSubtask = (todoId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) return;
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId) return todo;
        return {
          ...todo,
          subtasks: [
            ...todo.subtasks,
            {
              id: `sub-${Date.now()}`,
              title: subtaskTitle.trim(),
              completed: false,
            },
          ],
        };
      })
    );
  };

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId) return todo;
        return {
          ...todo,
          subtasks: todo.subtasks.filter((s) => s.id !== subtaskId),
        };
      })
    );
  };

  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        pendingCount,
        completedCount,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
