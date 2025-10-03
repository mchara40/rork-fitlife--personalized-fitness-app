const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

// Import schema
const schema = require('../db/schema.ts');

async function initDatabase() {
  console.log('Initializing database...');

  // Create database connection
  const sqlite = new Database('fitness.db');
  const db = drizzle(sqlite, { schema });

  // Hash password
  const adminPassword = await bcrypt.hash('admin123', 10);
  const now = new Date();

  const adminId = `user_${Date.now()}_admin`;

  try {
    // Insert admin user
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
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    sqlite.close();
  }
}

initDatabase().catch(console.error);
