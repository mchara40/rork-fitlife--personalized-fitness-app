import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Session, getSession, saveSession, clearSession, generateToken } from '@/lib/session';

export const [AuthContext, useAuth] = createContextHook(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const savedSession = await getSession();
      setSession(savedSession);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const token = generateToken();
      const newSession: Session = {
        userId: 'demo_user',
        email: email,
        name: 'Demo User',
        role: email.includes('admin') ? 'admin' : 'user',
        token,
      };

      await saveSession(newSession);
      setSession(newSession);

      return newSession;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    name: string;
    gender?: 'male' | 'female' | 'all';
  }) => {
    try {
      const token = generateToken();
      const newSession: Session = {
        userId: `user_${Date.now()}`,
        email: data.email,
        name: data.name,
        role: 'user',
        token,
      };

      await saveSession(newSession);
      setSession(newSession);

      return newSession;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearSession();
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const isAdmin = useMemo(() => session?.role === 'admin', [session]);

  return useMemo(() => ({
    session,
    isLoading,
    isAuthenticated: !!session,
    isAdmin,
    login,
    register,
    logout,
  }), [session, isLoading, isAdmin, login, register, logout]);
});
