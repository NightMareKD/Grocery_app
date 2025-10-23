import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pantryRoutes from './routes/pantry.js';
import shoppingRoutes from './routes/shopping.js';
import authRoutes from './routes/auth.js';
import mcpRoutes from './routes/mcp.js';
import { requireAuth } from './middleware/auth.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

// Verify environment variables
console.log('🔑 Environment Variables Status:');
console.log('  - GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('  - SEARCH_ENGINE_ID:', process.env.SEARCH_ENGINE_ID ? '✅ Loaded' : '❌ Missing');
console.log('  - HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✅ Loaded' : '❌ Missing');

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------------
// Middleware
// ------------------------
app.use(cors({ origin: 'http://localhost:5173' })); // allow frontend
app.use(express.json());

// ------------------------
// Routes
// ------------------------
app.use('/api/pantry', pantryRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mcp', mcpRoutes);

// Protected dashboard route
app.get('/api/dashboard', requireAuth, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.name || req.user.email}!`,
    user: req.user,
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

// ------------------------
// Start server
// ------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
