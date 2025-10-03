import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

async function initDatabase() {
  console.log('Initializing database...');

  const adminPassword = await hashPassword('admin123');
  const now = new Date();

  const adminId = `user_${Date.now()}_admin`;

  await db.insert(users).values({
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
}

initDatabase().catch(console.error);
