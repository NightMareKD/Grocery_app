import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// GET all shopping items
router.get('/', (req, res) => {
  db.all('SELECT * FROM shopping_items ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new shopping item
router.post('/', (req, res) => {
  const { name, quantity, category } = req.body;
  db.run(
    `INSERT INTO shopping_items (name, quantity, category) VALUES (?, ?, ?)`,
    [name, quantity, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, quantity, category });
    }
  );
});

// PUT update shopping item
router.put('/:id', (req, res) => {
  const { name, quantity, category } = req.body;
  db.run(
    `UPDATE shopping_items SET name = ?, quantity = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, quantity, category, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE shopping item
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM shopping_items WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

export default router;