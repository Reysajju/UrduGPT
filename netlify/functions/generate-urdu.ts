import { Handler } from '@netlify/functions';

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming request body
    const { query } = JSON.parse(event.body || '{}');
    
    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query is required' }),
      };
    }

    // Prepare the prompt with poetic Urdu instruction
    const promptText = `
      Act as a poetic Urdu language assistant. Create a response in Urdu poetry form following these rules:
      1. Use proper Urdu script
      2. Format as either Ghazal, Nazm, Rubai, or Qata
      3. Include poetic elements like metaphors (استعارہ), similes (تشبیہ), rhyme (قافیہ), and meter (بحر)
      4. End with a meaningful poetic conclusion (مقطع)
      5. Maintain accuracy while being poetic

      User's question: ${query}

      Please respond with Urdu poetry that addresses this query while following the above guidelines.
    `;

    // Prepare the payload for Google's API
    const payload = {
      prompt: { text: promptText },
      temperature: 0.8,
      maxOutputTokens: 512,
    };

    // Make the request to Google's API
    const response = await fetch(`${API_ENDPOINT}?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    const output = data.candidates?.[0]?.output || '';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ output }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}

export { handler };