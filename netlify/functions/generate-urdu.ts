import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const handler: Handler = async (event) => {
  // Only allow POST requests.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Log the raw event for debugging.
    console.log('Event body:', event.body);
    
    // Parse the incoming request body.
    const { query } = JSON.parse(event.body || '{}');

    if (!query) {
      console.error('Query is missing in the request body');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query is required' }),
      };
    }

    // Get the Google API key from environment variables.
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      console.error('GOOGLE_API_KEY is missing from environment variables');
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

    // Prepare the payload for Google's API.
    const payload = {
      prompt: { text: promptText },
      temperature: 0.8,
      maxOutputTokens: 512,
    };

    console.log('Sending payload to Google API:', payload);

    // Make the POST request to Google's API.
    const response = await fetch(`${API_ENDPOINT}?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google API returned status ${response.status}: ${errorText}`);
      throw new Error(`Google API Error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Google API response data:', data);

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
