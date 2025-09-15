import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'pantry.db');

// Open database
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    enableForeignKeys();
    initializeDatabase();
  }
});

// Enable foreign key constraints in SQLite
function enableForeignKeys() {
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.error('⚠️ Could not enable foreign keys:', err.message);
    } else {
      console.log('🔗 Foreign key enforcement enabled');
    }
  });
}

function initializeDatabase() {
  // Pantry items table
  const createPantryTableQuery = `
    CREATE TABLE IF NOT EXISTS pantry_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit TEXT,
      expiry_date DATE NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Shopping lists table
  const createShoppingListsTableQuery = `
    CREATE TABLE IF NOT EXISTS shopping_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Shopping items table (linked to shopping_lists)
  const createShoppingItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      checked INTEGER NOT NULL DEFAULT 0, -- 0 = unchecked, 1 = checked
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE
    )
  `;

  db.serialize(() => {
    db.run(createPantryTableQuery, (err) => {
      if (err) console.error('❌ Pantry table error:', err.message);
      else console.log('✅ Pantry table ready');
    });

    db.run(createShoppingListsTableQuery, (err) => {
      if (err) console.error('❌ Shopping lists table error:', err.message);
      else console.log('✅ Shopping lists table ready');
    });

    db.run(createShoppingItemsTableQuery, (err) => {
      if (err) console.error('❌ Shopping items table error:', err.message);
      else console.log('✅ Shopping items table ready');
    });
  });
}

export default db;
