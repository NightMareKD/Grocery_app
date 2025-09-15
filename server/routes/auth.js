import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import db from '../database.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Helper to create JWT
function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

// Signup with email/password
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)', [email, name || null, hash], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email already exists' });
        return res.status(500).json({ error: err.message });
      }
      const user = { id: this.lastID, email, name };
      const token = createToken(user);
      res.json({ token, user });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login with email/password
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row || !row.password_hash) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const user = { id: row.id, email: row.email, name: row.name };
    const token = createToken(user);
    res.json({ token, user });
  });
});

// Google sign-in: verify idToken from client and create/find user
router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken required' });
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const googleSub = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Check if user exists by google_sub or email
    db.get('SELECT * FROM users WHERE google_sub = ? OR email = ?', [googleSub, email], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (row) {
        // update google_sub if missing
        if (!row.google_sub) {
          db.run('UPDATE users SET google_sub = ? WHERE id = ?', [googleSub, row.id]);
        }
        const token = createToken({ id: row.id, email: row.email, name: row.name });
        return res.json({ token, user: { id: row.id, email: row.email, name: row.name } });
      }

      // create new user
      db.run('INSERT INTO users (email, name, google_sub) VALUES (?, ?, ?)', [email, name, googleSub], function(insertErr) {
        if (insertErr) return res.status(500).json({ error: insertErr.message });
        const user = { id: this.lastID, email, name };
        const token = createToken(user);
        res.json({ token, user });
      });
    });
  } catch (e) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

export default router;