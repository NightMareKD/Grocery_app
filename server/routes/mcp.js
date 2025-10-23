import express from 'express';

const router = express.Router();

// ------------------------
// POST /api/mcp/recipes
// ------------------------
router.post('/recipes', async (req, res) => {
  const { prompt } = req.body;
  console.log('📝 MCP Recipe Request:', { prompt });

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // This model (T5) is trained to take ingredients as input.
    // We add a prefix for the best results.
    const fullPrompt = `You are a professional chef. Summarize the recipe and only the recipe relevant for the following food:

food: ${prompt}

Provide a concise recipe with:
- A brief description of the dish
- Key ingredients
- Simplified cooking steps
- Total cooking time
- Number of servings.`;

    // Hugging Face Space request
    console.log('🤖 Sending request to Hugging Face Space...');
    const hfResponse = await fetch('https://isharadeshan3-cooking.hf.space/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        max_new_tokens: 800,
        temperature: 0.8,
        top_p: 0.9,
        num_return_sequences: 1
      }),
    });

    console.log('🤖 Response Status:', hfResponse.status);
    const responseText = await hfResponse.text();
    console.log('🤖 Raw Response:', responseText);

    if (!hfResponse.ok) {
      let error;
      try { error = JSON.parse(responseText); }
      catch { error = { error: responseText || 'Request failed' }; }
      
      // Handle model loading error (503)
      if (hfResponse.status === 503 && error.error && error.error.includes("loading")) {
        console.warn('⚠️ Model is loading, please try again...');
        return res.status(503).json({ error: 'Model is loading, please try again in a moment.' });
      }

      console.error('❌ Hugging Face Error:', error);
      return res.status(hfResponse.status).json({ error: error.detail || error.error || 'Model inference failed' });
    }

    const hfData = JSON.parse(responseText);
    console.log('🤖 Parsed model output:', JSON.stringify(hfData, null, 2));

    let reply = hfData.results && hfData.results.length > 0
      ? hfData.results[0]
      : 'The model did not generate a complete recipe. Please try again with a more specific request.';

    console.log('✅ Final Response Sent to Frontend:', { reply });
    res.json({ reply });

  } catch (error) {
    console.error('❌ MCP Server Error:', error);
    console.error('❌ Error Stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// ------------------------
// POST /api/mcp/analyze
// (No changes needed)
// ------------------------
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

// ------------------------
// POST /api/mcp/embed
// (No changes needed)
// ------------------------
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