import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo, TodoPriority } from '../../types/todo';

export interface AddTodoPayload {
  title: string;
  priority: TodoPriority;
  time?: string;
  subtasks?: string[];
}

export interface TodoState {
  todos: Todo[];
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

const initialState: TodoState = {
  todos: INITIAL_TODOS,
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<AddTodoPayload>) => {
      const { title, priority, time, subtasks = [] } = action.payload;
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
      state.todos.unshift(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        const nextCompleted = !todo.completed;
        todo.completed = nextCompleted;
        if (nextCompleted) {
          todo.subtasks.forEach((s) => {
            s.completed = true;
          });
        }
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    toggleSubtask: (
      state,
      action: PayloadAction<{ todoId: string; subtaskId: string }>
    ) => {
      const { todoId, subtaskId } = action.payload;
      const todo = state.todos.find((t) => t.id === todoId);
      if (todo) {
        const subtask = todo.subtasks.find((s) => s.id === subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
          const allCompleted =
            todo.subtasks.length > 0 && todo.subtasks.every((s) => s.completed);
          if (allCompleted) {
            todo.completed = true;
          }
        }
      }
    },
    addSubtask: (
      state,
      action: PayloadAction<{ todoId: string; title: string }>
    ) => {
      const { todoId, title } = action.payload;
      if (!title.trim()) return;
      const todo = state.todos.find((t) => t.id === todoId);
      if (todo) {
        todo.subtasks.push({
          id: `sub-${Date.now()}`,
          title: title.trim(),
          completed: false,
        });
      }
    },
    deleteSubtask: (
      state,
      action: PayloadAction<{ todoId: string; subtaskId: string }>
    ) => {
      const { todoId, subtaskId } = action.payload;
      const todo = state.todos.find((t) => t.id === todoId);
      if (todo) {
        todo.subtasks = todo.subtasks.filter((s) => s.id !== subtaskId);
      }
    },
    resetTodos: () => initialState,
    setTodosState: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  toggleSubtask,
  addSubtask,
  deleteSubtask,
  setTodosState,
  resetTodos,
} = todoSlice.actions;

export default todoSlice.reducer;
