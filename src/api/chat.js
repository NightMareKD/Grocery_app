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