import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// POST /api/mcp/recipes
router.post('/recipes', async (req, res) => {
  const { prompt } = req.body;

  console.log('📝 MCP Recipe Request:', { prompt });

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Step 1: Search the internet for relevant information
    console.log('🔍 Searching the internet for relevant recipes...');
    const searchResponse = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(prompt)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}`);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok || !searchData.items || searchData.items.length === 0) {
      return res.status(404).json({ error: 'No relevant information found on the internet.' });
    }

    // Extract the top result
    const topResult = searchData.items[0];
    const content = `${topResult.title}\n\n${topResult.snippet}\n\nRead more: ${topResult.link}`;

    // Step 2: Use Hugging Face model to process the gathered information
    console.log('🤖 Sending gathered information to Hugging Face model...');
    const hfResponse = await fetch('https://isharadeshan3-cooking.hf.space/invoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Summarize the following recipe information:\n\n${content}`,
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.95,
        num_return_sequences: 1,
      }),
    });

    if (!hfResponse.ok) {
      const error = await hfResponse.json().catch(() => ({ error: 'Request failed' }));
      console.error('❌ Hugging Face Error:', error);
      return res.status(hfResponse.status).json({ error: error.detail || error.error || 'Model inference failed' });
    }

    const hfData = await hfResponse.json();
    const reply = hfData.results && hfData.results.length > 0
      ? hfData.results[0]
      : hfData.reply || hfData.response || hfData.generated_text || 'No response generated.';

    // Step 3: Format the final response
    const formattedReply = `
### Recipe for ${prompt}

**Introduction:**
This recipe is based on the top search result for "${prompt}". Follow the steps below to create a delicious dish.

**Details:**
${content}

**Generated Recipe:**
${reply}
`;

    res.json({ reply: formattedReply });
  } catch (error) {
    console.error('❌ MCP Server Error:', error);
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