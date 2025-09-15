import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'pantry.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
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

  // New: Shopping lists table
  const createShoppingListsTableQuery = `
    CREATE TABLE IF NOT EXISTS shopping_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // New: Shopping items table with list_id and checked
  const createShoppingItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      checked INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE
    )
  `;

  db.run(createPantryTableQuery, (err) => {
    if (err) {
      console.error('Error creating pantry table:', err.message);
    } else {
      console.log('Pantry table initialized');
    }
  });

  db.run(createShoppingListsTableQuery, (err) => {
    if (err) {
      console.error('Error creating shopping_lists table:', err.message);
    } else {
      console.log('Shopping lists table initialized');
    }
  });

  db.run(createShoppingItemsTableQuery, (err) => {
    if (err) {
      console.error('Error creating shopping_items table:', err.message);
    } else {
      console.log('Shopping items table initialized');
    }
  });
}

export default db;