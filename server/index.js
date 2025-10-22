import express from 'express';
import cors from 'cors';
import pantryRoutes from './routes/pantry.js';
import shoppingRoutes from './routes/shopping.js';
import authRoutes from './routes/auth.js';
import mcpRoutes from './routes/mcp.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pantry', pantryRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mcp', mcpRoutes);

// ✅ Protected dashboard route
app.get('/api/dashboard', requireAuth, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.name || req.user.email}!`,
    user: req.user, // includes id, email, name from JWT
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Grocery Pantry API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
