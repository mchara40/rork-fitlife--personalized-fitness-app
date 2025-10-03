import * as schema from './schema';

let db: any = null;

// Run only in server/node environments
if (typeof window === 'undefined') {
  try {
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    const Database = require('better-sqlite3');
    const sqlite = new Database('fitness.db');
    db = drizzle(sqlite, { schema });
  } catch (error) {
    console.log('Database not available on client side');
  }
}

export { db };
