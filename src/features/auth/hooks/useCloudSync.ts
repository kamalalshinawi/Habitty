import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setHabitsState } from '../../habits/habitSlice';
import { setTodosState } from '../../todos/todoSlice';
import {
  fetchUserHabits,
  fetchUserTodos,
  syncUserHabits,
  syncUserTodos,
} from '../../../services/firestoreService';

export function useCloudSync() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const habits = useAppSelector((state) => state.habits.habits);
  const habitDays = useAppSelector((state) => state.habits.habitDays);
  const todos = useAppSelector((state) => state.todos.todos);

  const initialLoadDone = useRef<string | null>(null);
  const latestDataRef = useRef({ habits, habitDays, todos });
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    latestDataRef.current = { habits, habitDays, todos };
  }, [habits, habitDays, todos]);

  // 1. On user change / login: Load user's data from Firestore
  useEffect(() => {
    if (!user?.uid) {
      initialLoadDone.current = null;
      return;
    }

    const userId = user.uid;

    // Only load if not already loaded for this user UID
    if (initialLoadDone.current === userId) return;

    let isMounted = true;

    async function loadUserData() {
      try {
        const [cloudHabits, cloudTodos] = await Promise.all([
          fetchUserHabits(userId),
          fetchUserTodos(userId),
        ]);

        if (!isMounted) return;

        if (cloudHabits !== null) {
          dispatch(
            setHabitsState({
              habits: cloudHabits.habits,
              habitDays: cloudHabits.habitDays,
            })
          );
        } else {
          // Initialize new account with starting data
          await syncUserHabits(
            userId,
            latestDataRef.current.habits,
            latestDataRef.current.habitDays
          );
        }

        if (cloudTodos !== null) {
          dispatch(setTodosState(cloudTodos.todos));
        } else {
          // Initialize new account with starting data
          await syncUserTodos(userId, latestDataRef.current.todos);
        }

        initialLoadDone.current = userId;
      } catch (err) {
        console.warn('Could not sync data from Firestore:', err);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, dispatch]);

  // 2. On habits or todos state change: Auto-sync to Firestore (debounced 1.5s)
  useEffect(() => {
    if (!user?.uid || initialLoadDone.current !== user.uid) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await Promise.all([
          syncUserHabits(user.uid, habits, habitDays),
          syncUserTodos(user.uid, todos),
        ]);
      } catch (err) {
        console.warn('Background sync to Firestore failed:', err);
      }
    }, 1500);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [user?.uid, habits, habitDays, todos]);
}
