import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all pantry items
router.get('/', (req, res) => {
  const query = `
    SELECT id, name, quantity, unit, expiry_date, notes, created_at
    FROM pantry_items
    ORDER BY 
      CASE 
        WHEN expiry_date IS NULL THEN 1 
        ELSE 0 
      END,
      expiry_date ASC,
      name ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get single pantry item
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM pantry_items WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(row);
  });
});

// Create new pantry item
router.post('/', (req, res) => {
  const { name, quantity = 1, unit, expiry_date, notes } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than 0' });
  }

  if (expiry_date && new Date(expiry_date) < new Date().setHours(0, 0, 0, 0)) {
    return res.status(400).json({ error: 'Expiry date cannot be in the past' });
  }

  const query = `
    INSERT INTO pantry_items (name, quantity, unit, expiry_date, notes)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [name.trim(), quantity, unit, expiry_date || null, notes], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    // Get the created item
    db.get('SELECT * FROM pantry_items WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json(row);
    });
  });
});

// Update pantry item
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit, expiry_date, notes } = req.body;

  if (name !== undefined && (!name || !name.trim())) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (quantity !== undefined && quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than 0' });
  }

  if (expiry_date && new Date(expiry_date) < new Date().setHours(0, 0, 0, 0)) {
    return res.status(400).json({ error: 'Expiry date cannot be in the past' });
  }

  // Build dynamic query
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name.trim());
  }
  if (quantity !== undefined) {
    updates.push('quantity = ?');
    values.push(quantity);
  }
  if (unit !== undefined) {
    updates.push('unit = ?');
    values.push(unit);
  }
  if (expiry_date !== undefined) {
    updates.push('expiry_date = ?');
    values.push(expiry_date || null);
  }
  if (notes !== undefined) {
    updates.push('notes = ?');
    values.push(notes);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(id);
  const query = `UPDATE pantry_items SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Get the updated item
    db.get('SELECT * FROM pantry_items WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(row);
    });
  });
});

// Delete pantry item
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM pantry_items WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(204).send();
  });
});

export default router;