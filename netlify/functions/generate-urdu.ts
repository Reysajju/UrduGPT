import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

// Use the Gemini endpoint as per your example.
const API_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const handler: Handler = async (event) => {
  // Only allow POST requests.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming request body.
    const { query } = JSON.parse(event.body || '{}');

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query is required' }),
      };
    }

    // Get the Google API key from environment variables.
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Google API key is not configured' }),
      };
    }

    // Prepare the prompt with poetic Urdu instructions.
    const promptText = `
Act as a poetic Urdu language assistant. Create a response in Urdu poetry form following these rules:
1. Use proper Urdu script.
2. Format as either Ghazal, Nazm, Rubai, or Qata.
3. Include poetic elements like metaphors (استعارہ), similes (تشبیہ), rhyme (قافیہ), and meter (بحر).
4. End with a meaningful poetic conclusion (مقطع).
5. Maintain accuracy while being poetic.

User's question: ${query}

Please respond with Urdu poetry that addresses this query while following the above guidelines.
    `.trim();

    // Prepare the payload according to the Gemini API specification.
    const payload = {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ]
    };

    // Make the POST request to Google's Gemini API.
    const response = await fetch(`${API_ENDPOINT}?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API Error: ${errorText}`);
    }

    const data = await response.json();

    // NOTE: Adjust the following extraction based on the actual response format.
    // The code below assumes the generated content is in data.candidates[0].output.
    // If the Gemini API returns a different property name (e.g., "text" or "content"), update accordingly.
    const output = data.candidates?.[0]?.output || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output }),
    };
  } catch (error: any) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

export { handler };
