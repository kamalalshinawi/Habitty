import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setUser,
  setLoading,
  setError,
  clearError,
  signOutSuccess,
} from '../authSlice';
import {
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset,
  logOut,
  subscribeToAuthChanges,
  formatAuthError,
  type AuthUserProfile,
} from '../../../services/authService';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, isInitialized, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = subscribeToAuthChanges((firebaseUser: AuthUserProfile | null) => {
      dispatch(setUser(firebaseUser));
    });
    return () => unsubscribe();
  }, [dispatch]);

  const signUp = useCallback(
    async (email: string, pass: string, name: string) => {
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const newUser = await signUpWithEmail(email, pass, name);
        dispatch(setUser(newUser));
        return { success: true };
      } catch (err: any) {
        const msg = formatAuthError(err?.code || '');
        dispatch(setError(msg));
        return { success: false, error: msg };
      }
    },
    [dispatch]
  );

  const signIn = useCallback(
    async (email: string, pass: string) => {
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const loggedInUser = await signInWithEmail(email, pass);
        dispatch(setUser(loggedInUser));
        return { success: true };
      } catch (err: any) {
        const msg = formatAuthError(err?.code || '');
        dispatch(setError(msg));
        return { success: false, error: msg };
      }
    },
    [dispatch]
  );

  const signOut = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await logOut();
      dispatch(signOutSuccess());
    } catch (err: any) {
      dispatch(setError(err?.message || 'Failed to sign out'));
    }
  }, [dispatch]);

  const resetPassword = useCallback(
    async (email: string) => {
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        await sendPasswordReset(email);
        dispatch(setLoading(false));
        return { success: true };
      } catch (err: any) {
        const msg = formatAuthError(err?.code || '');
        dispatch(setError(msg));
        return { success: false, error: msg };
      }
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearAuthError,
  };
}
