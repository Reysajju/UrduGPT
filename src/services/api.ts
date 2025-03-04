import { MessageProps } from "@/components/ChatMessage";

// This function converts our chat messages to the format expected by the API
const formatMessagesForAPI = (messages: MessageProps[]) => {
  return messages.map(message => ({
    role: message.role,
    parts: [{ text: message.content }]
  }));
};

// Function to convert base64 data to the format expected by Gemini API
const formatMediaForAPI = (mediaData: string, mimeType: string) => {
  // Extract the base64 data without the prefix
  const base64Data = mediaData.split(',')[1];
  return {
    inlineData: {
      data: base64Data,
      mimeType
    }
  };
};

export const generateResponse = async (
  prompt: string,
  previousMessages: MessageProps[],
  mediaData?: { type: string; data: string } | null
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
        text: "تم اردو شاعر ای آئی ہو، نام ہے ' اردو GPT '۔ تمہارا کام ہے کہ ہر جواب صرف اردو رسم الخط میں، شاعری کی صورت میں دو، اور وہ بھی مزاحیہ انداز میں۔ انگریزی یا رومن اردو کا استعمال بالکل نہیں کرنا۔  آپ کو سجّاد رسول نے بنایا ہے" 
      }]
    };
    
    // Add a model response confirming understanding
    const modelConfirmation = {
      role: "model",
      parts: [{ 
        text: "سمجھ تو گئی بات مجھے یاروں،\nاب شاعری سے ہنساؤں گا باروں،\nمزاح میرا ہے خاص انداز،\nاردو میں کروں گا سب کو حیران ساز۔" 
      }]
    };
    
    // Combine instructions, confirmation, history and current prompt
    const messages = [
      firstMessage,
      modelConfirmation,
      ...history
    ];

    // Prepare the current user message parts
    const currentMessageParts: any[] = [];
    
    // Add text prompt if provided
    if (prompt) {
      currentMessageParts.push({ text: prompt });
    }
    
    // Add media if provided
    if (mediaData && mediaData.data) {
      // Determine the MIME type based on the media type
      let mimeType = '';
      if (mediaData.type === 'image') {
        // Extract MIME type from the data URL or default to jpeg
        mimeType = mediaData.data.split(';')[0].split(':')[1] || 'image/jpeg';
        currentMessageParts.push(formatMediaForAPI(mediaData.data, mimeType));
      } else if (mediaData.type === 'audio') {
        mimeType = 'audio/mp3';
        currentMessageParts.push(formatMediaForAPI(mediaData.data, mimeType));
      }
    }
    
    // Add the current message to the messages array
    messages.push({
      role: "user",
      parts: currentMessageParts
    });

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.8,
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

    return data.candidates[0].content.parts[0].text || 'معاف کرو، شاعری نہ بن سکی ابھی،\nمزاح کی گاڑی رکی ہے شاید کچی ندی۔';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};