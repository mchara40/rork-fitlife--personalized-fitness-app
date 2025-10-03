export async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined') {
    const bcrypt = require('bcryptjs');
    return bcrypt.hash(password, 10);
  }
  throw new Error('Password hashing only available on server');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, hash);
  }
  throw new Error('Password verification only available on server');
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  gender?: 'male' | 'female' | 'all';
  role?: 'user' | 'admin';
}) {
  if (typeof window === 'undefined') {
    const { db } = require('@/db');
    const { users } = require('@/db/schema');
    
    const passwordHash = await hashPassword(data.password);
    const now = new Date();
    
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.insert(users).values({
      id: userId,
      email: data.email,
      name: data.name,
      passwordHash,
      gender: data.gender || 'all',
      role: data.role || 'user',
      trialUsed: false,
      createdAt: now,
      updatedAt: now,
    });
    
    return userId;
  }
  
  throw new Error('User creation only available on server');
}

export async function authenticateUser(email: string, password: string) {
  if (typeof window === 'undefined') {
    const { db } = require('@/db');
    const { users } = require('@/db/schema');
    const { eq } = require('drizzle-orm');
    
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    if (!user) {
      return null;
    }
    
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
      role: user.role,
    };
  }
  
  throw new Error('Authentication only available on server');
}

export function isAdmin(role: string): boolean {
  return role === 'admin';
}
