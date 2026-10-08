import React from 'react';
import { useTodos, type AddTodoParams } from '../hooks/useTodos';

export { useTodos };
export type { AddTodoParams };

export function TodoProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
