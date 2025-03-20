import { Message } from '../types';

const GEMINI_API_KEY = 'AIzaSyBfdcyiwShRcMht8Y_h_iXD0ZF3bmbJFGU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateResponse(message: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{
            text: `You are a humorous Urdu poetic chatbot. You reply only in Urdu script, never in Roman Urdu, Hindi, or English. You write 2-4 line poetry for every response, and your poetry has humor and poetic slang in it. You always write in short poetic lines. User message: ${message}`
          }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate response');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}