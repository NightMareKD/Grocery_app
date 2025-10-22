// Stub for MCP server integration. Replace endpoint with your MCP server route.
export async function askRecipe(prompt) {
  try {
    const response = await fetch('/api/mcp/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error in askRecipe:', error);
    throw error;
  }
}

export async function analyzeText(text) {
  try {
    const response = await fetch('/api/mcp/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze text');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in analyzeText:', error);
    throw error;
  }
}

export async function embedText(text) {
  try {
    const response = await fetch('/api/mcp/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to embed text');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in embedText:', error);
    throw error;
  }
}