import { Session } from './session';

export function requireAuth(session: Session | null): Session {
  if (!session) {
    throw new Error('Unauthorized: Please log in');
  }
  return session;
}

export function requireAdmin(session: Session | null): Session {
  const user = requireAuth(session);
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}
