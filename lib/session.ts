import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@fitness_session';

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  token: string;
}

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<Session | null> {
  const data = await AsyncStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}
