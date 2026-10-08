import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Habit, HabitStatus } from '../types/habit';
import type { Todo } from '../types/todo';

export interface UserHabitsData {
  habits: Habit[];
  habitDays: Record<string, HabitStatus>;
  updatedAt?: unknown;
}

export interface UserTodosData {
  todos: Todo[];
  updatedAt?: unknown;
}

/**
 * Sync user habits to Firestore under users/{userId}/data/habits
 */
export async function syncUserHabits(
  userId: string,
  habits: Habit[],
  habitDays: Record<string, HabitStatus>
): Promise<void> {
  if (!userId) return;
  const docRef = doc(db, 'users', userId, 'data', 'habits');
  await setDoc(
    docRef,
    {
      habits,
      habitDays,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Sync user todos to Firestore under users/{userId}/data/todos
 */
export async function syncUserTodos(
  userId: string,
  todos: Todo[]
): Promise<void> {
  if (!userId) return;
  const docRef = doc(db, 'users', userId, 'data', 'todos');
  await setDoc(
    docRef,
    {
      todos,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Fetch habits data for a user from Firestore
 */
export async function fetchUserHabits(
  userId: string
): Promise<UserHabitsData | null> {
  if (!userId) return null;
  const docRef = doc(db, 'users', userId, 'data', 'habits');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    return {
      habits: data.habits || [],
      habitDays: data.habitDays || {},
    };
  }
  return null;
}

/**
 * Fetch todos data for a user from Firestore
 */
export async function fetchUserTodos(
  userId: string
): Promise<UserTodosData | null> {
  if (!userId) return null;
  const docRef = doc(db, 'users', userId, 'data', 'todos');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    return {
      todos: data.todos || [],
    };
  }
  return null;
}

/**
 * Real-time listener for user habits
 */
export function subscribeToUserHabits(
  userId: string,
  onData: (data: UserHabitsData) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, 'users', userId, 'data', 'habits');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onData({
          habits: data.habits || [],
          habitDays: data.habitDays || {},
        });
      }
    },
    onError
  );
}

/**
 * Real-time listener for user todos
 */
export function subscribeToUserTodos(
  userId: string,
  onData: (data: UserTodosData) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, 'users', userId, 'data', 'todos');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onData({
          todos: data.todos || [],
        });
      }
    },
    onError
  );
}
