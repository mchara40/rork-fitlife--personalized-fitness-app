import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function initDatabase() {
  console.log('Initializing database...');

  const sqlite = new Database('fitness.db');
  const db = drizzle(sqlite, { schema });

  const adminPassword = await hashPassword('admin123');
  const now = new Date();

  const adminId = `user_${Date.now()}_admin`;

  await db.insert(schema.users).values({
    id: adminId,
    email: 'admin@fitness.com',
    name: 'Admin User',
    passwordHash: adminPassword,
    gender: 'all',
    role: 'admin',
    trialUsed: false,
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing();

  console.log('Database initialized successfully!');
  console.log('Admin credentials:');
  console.log('Email: admin@fitness.com');
  console.log('Password: admin123');
  console.log('\nPlease change the admin password after first login!');
  
  sqlite.close();
}

initDatabase().catch(console.error);
