import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// ===== Shopping Lists =====

// GET all lists with their items
router.get('/lists', (req, res) => {
  const listsQuery = `SELECT * FROM shopping_lists ORDER BY created_at DESC`;
  db.all(listsQuery, [], (err, lists) => {
    if (err) return res.status(500).json({ error: err.message });

    // Fetch items for each list
    const listIds = lists.map(l => l.id);
    if (!listIds.length) return res.json([]);

    const placeholders = listIds.map(() => '?').join(',');
    const itemsQuery = `SELECT * FROM shopping_items WHERE list_id IN (${placeholders}) ORDER BY created_at DESC`;
    db.all(itemsQuery, listIds, (err2, items) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Map items to their lists
      const result = lists.map(list => ({
        ...list,
        items: items.filter(i => i.list_id === list.id)
      }));
      res.json(result);
    });
  });
});

// POST create new list
router.post('/lists', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'List name is required' });

  const query = `INSERT INTO shopping_lists (name) VALUES (?)`;
  db.run(query, [name], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, items: [] });
  });
});

// DELETE a list and its items (CASCADE ensures items are removed)
router.delete('/lists/:id', (req, res) => {
  const query = `DELETE FROM shopping_lists WHERE id = ?`;
  db.run(query, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// ===== Shopping Items =====

// POST add new item to a list
router.post('/lists/:listId/items', (req, res) => {
  const { listId } = req.params;
  const { name, quantity = 1 } = req.body;
  if (!name) return res.status(400).json({ error: 'Item name is required' });

  const query = `INSERT INTO shopping_items (list_id, name, quantity) VALUES (?, ?, ?)`;
  db.run(query, [listId, name, quantity], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, list_id: Number(listId), name, quantity, checked: 0 });
  });
});

// PATCH update item (e.g., toggle checked)
router.patch('/lists/:listId/items/:itemId', (req, res) => {
  const { listId, itemId } = req.params;
  const { name, quantity, checked } = req.body;

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (quantity !== undefined) {
    fields.push('quantity = ?');
    values.push(quantity);
  }
  if (checked !== undefined) {
    fields.push('checked = ?');
    values.push(checked ? 1 : 0);
  }

  if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

  fields.push('updated_at = CURRENT_TIMESTAMP');

  const query = `UPDATE shopping_items SET ${fields.join(', ')} WHERE id = ? AND list_id = ?`;
  values.push(itemId, listId);

  db.run(query, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// DELETE an item
router.delete('/lists/:listId/items/:itemId', (req, res) => {
  const { listId, itemId } = req.params;
  const query = `DELETE FROM shopping_items WHERE id = ? AND list_id = ?`;
  db.run(query, [itemId, listId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

export default router;
