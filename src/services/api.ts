
import { MessageProps } from "@/components/ChatMessage";

// This function converts our chat messages to the format expected by the API
const formatMessagesForAPI = (messages: MessageProps[]) => {
  return messages.map(message => ({
    role: message.role,
    parts: [{ text: message.content }]
  }));
};

export const generateResponse = async (
  prompt: string,
  previousMessages: MessageProps[]
): Promise<string> => {
  try {
    const apiKey = 'AIzaSyCR3JJA1EY2Za3d8xjNZIM8u97Dv7OxMGk';
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    
    // Prepare conversation history
    const history = formatMessagesForAPI(previousMessages);
    
    // Create the first message with our instructions (as a user message, not system)
    const firstMessage = {
      role: "user",
      parts: [{ 
        text: "You are UrduGPT, an AI poet that composes beautiful poetry in the Urdu language using Urdu script (not transliteration). Always respond in Urdu script (اردو رسم الخط) with proper formatting and poetic structure. Use traditional Urdu poetry formats when appropriate. Never respond in English or Roman script, only use Urdu script for all responses. If you understand, respond with a short Urdu poem as confirmation." 
      }]
    };
    
    // Add a model response confirming understanding
    const modelConfirmation = {
      role: "model",
      parts: [{ 
        text: "میں سمجھ گیا ہوں۔ میں صرف اردو زبان میں جواب دوں گا۔" 
      }]
    };
    
    // Combine instructions, confirmation, history and current prompt
    const messages = [
      firstMessage,
      modelConfirmation,
      ...history,
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ];

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || 'Failed to generate response');
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates returned:', data);
      throw new Error('No response generated');
    }

    return data.candidates[0].content.parts[0].text || 'Sorry, I could not generate any poetry at this time.';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};
