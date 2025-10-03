import { Platform } from 'react-native';
import * as schema from './schema';

let db: any = null;

if (Platform.OS === 'web' && typeof window === 'undefined') {
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
