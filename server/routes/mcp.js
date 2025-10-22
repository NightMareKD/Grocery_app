import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Replace with your Hugging Face API key
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// POST /api/mcp/recipes
router.post('/recipes', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error || 'Model inference failed' });
    }

    const data = await response.json();
    const reply = data.generated_text || 'No response generated.';
    res.json({ reply });
  } catch (error) {
    console.error('MCP Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/mcp/analyze
router.post('/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch('https://isharadeshan3-distilbert-mcp-server2.hf.space/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error || 'Analysis failed' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Analyze Endpoint Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/mcp/embed
router.post('/embed', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await fetch('https://isharadeshan3-distilbert-mcp-server2.hf.space/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error || 'Embedding failed' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Embed Endpoint Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;