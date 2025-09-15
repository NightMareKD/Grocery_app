import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid Authorization header' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}