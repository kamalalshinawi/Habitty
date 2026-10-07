export type TodoPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  time?: string;
  subtasks: Subtask[];
  createdAt: string;
}
