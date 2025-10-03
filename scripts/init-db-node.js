const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  console.log('Initializing database...');

  // Create database connection
  const sqlite = new Database('fitness.db');

  try {
    // Create tables
    const createTablesSQL = `
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      gender TEXT NOT NULL DEFAULT 'all' CHECK (gender IN ('male', 'female', 'all')),
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      trial_used INTEGER NOT NULL DEFAULT 0 CHECK (trial_used IN (0, 1)),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Create subscriptions table
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL CHECK (plan IN ('1_month', '3_months', '6_months', '1_year')),
      start_date INTEGER NOT NULL,
      end_date INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      is_trial INTEGER NOT NULL DEFAULT 0 CHECK (is_trial IN (0, 1)),
      auto_renew INTEGER NOT NULL DEFAULT 0 CHECK (auto_renew IN (0, 1)),
      stripe_subscription_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Create payment_cards table
    CREATE TABLE IF NOT EXISTS payment_cards (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      card_fingerprint TEXT NOT NULL,
      last4 TEXT NOT NULL,
      brand TEXT NOT NULL,
      stripe_payment_method_id TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    -- Create exercises table
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      video_url TEXT,
      thumbnail_url TEXT,
      type TEXT NOT NULL CHECK (type IN ('strength', 'cardio', 'flexibility', 'plyometric')),
      muscle_groups TEXT NOT NULL,
      equipment TEXT NOT NULL,
      instructions TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Create workout_programs table
    CREATE TABLE IF NOT EXISTS workout_programs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      goal TEXT NOT NULL CHECK (goal IN ('muscle_building', 'functional_hybrid', 'combat_sports', 'weight_loss', 'endurance', 'strength')),
      gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'all')),
      duration INTEGER NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
      thumbnail_url TEXT,
      is_premium INTEGER NOT NULL DEFAULT 1 CHECK (is_premium IN (0, 1)),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Create workouts table
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL REFERENCES workout_programs(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
      order_index INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Create workout_exercises table
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
      exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
      sets INTEGER,
      reps INTEGER,
      duration INTEGER,
      rest_time INTEGER,
      notes TEXT,
      order_index INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    -- Create exercise_logs table
    CREATE TABLE IF NOT EXISTS exercise_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      exercise_id TEXT NOT NULL REFERENCES exercises(id),
      workout_id TEXT NOT NULL REFERENCES workouts(id),
      program_id TEXT NOT NULL REFERENCES workout_programs(id),
      date INTEGER NOT NULL,
      notes TEXT,
      created_at INTEGER NOT NULL
    );

    -- Create set_logs table
    CREATE TABLE IF NOT EXISTS set_logs (
      id TEXT PRIMARY KEY,
      exercise_log_id TEXT NOT NULL REFERENCES exercise_logs(id) ON DELETE CASCADE,
      set_number INTEGER NOT NULL,
      weight REAL,
      reps INTEGER,
      duration INTEGER,
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
      created_at INTEGER NOT NULL
    );
    `;

    // Execute table creation
    sqlite.exec(createTablesSQL);

    // Hash password for admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const now = Date.now();

    // Insert admin user
    const insertAdmin = sqlite.prepare(`
      INSERT OR IGNORE INTO users (
        id, email, name, password_hash, gender, role, trial_used, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAdmin.run(
      'user_admin_001',
      'admin@fitness.com',
      'Admin User',
      adminPassword,
      'all',
      'admin',
      0,
      now,
      now
    );

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
