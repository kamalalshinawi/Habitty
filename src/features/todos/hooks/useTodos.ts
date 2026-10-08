import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addTodo as addTodoAction,
  toggleTodo as toggleTodoAction,
  deleteTodo as deleteTodoAction,
  toggleSubtask as toggleSubtaskAction,
  addSubtask as addSubtaskAction,
  deleteSubtask as deleteSubtaskAction,
  type AddTodoPayload,
} from '../todoSlice';

export type AddTodoParams = AddTodoPayload;

export function useTodos() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);

  const addTodo = useCallback(
    (params: AddTodoParams) => {
      dispatch(addTodoAction(params));
    },
    [dispatch]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      dispatch(toggleTodoAction(id));
    },
    [dispatch]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      dispatch(deleteTodoAction(id));
    },
    [dispatch]
  );

  const toggleSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      dispatch(toggleSubtaskAction({ todoId, subtaskId }));
    },
    [dispatch]
  );

  const addSubtask = useCallback(
    (todoId: string, title: string) => {
      dispatch(addSubtaskAction({ todoId, title }));
    },
    [dispatch]
  );

  const deleteSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      dispatch(deleteSubtaskAction({ todoId, subtaskId }));
    },
    [dispatch]
  );

  const pendingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    pendingCount,
    completedCount,
  };
}
