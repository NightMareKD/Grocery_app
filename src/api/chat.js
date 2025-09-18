// Stub for MCP server integration. Replace endpoint with your MCP server route.
export async function askRecipe(prompt) {
  try {
    const res = await fetch('/api/mcp/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply ?? 'No reply received.';
    }
  } catch {}
  // Fallback stub
  return `Here’s a simple idea:

- One-Pan Chicken & Rice
- Sear chicken, sauté aromatics, toast rice, add stock, simmer 15–18m, finish with peas.
- Season with paprika, lemon zest, parsley.`;
}