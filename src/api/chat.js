// chat.js

export async function askRecipe(prompt) {
  try {
    // Use Vite proxy or direct backend URL
    const response = await fetch('/api/mcp/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      // Try to parse backend error
      const errData = await response.json().catch(() => ({}));
      console.error('Backend Error Response:', errData);
      throw new Error(errData.error || 'Failed to fetch recipe');
    }

    const data = await response.json();
    const reply = data.reply || 'Sorry, no recipe was generated.';
    console.log('🛠 Backend Reply:', reply);
    return reply;
  } catch (error) {
    console.error('Error in askRecipe:', error);
    return 'Sorry, I could not fetch a recipe right now.';
  }
}
