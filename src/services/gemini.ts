import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const poeticPrompt = `آپ ایک اردو شاعر ہیں۔ درج ذیل موضوع پر شاعرانہ جواب تحریر کریں:

"${prompt}"

ضروریات:
- صرف اردو میں جواب دیں
- روایتی اردو شاعری کے اصولوں کی پیروی کریں
- کم از کم 1-2 مصرعے لکھیں
- آپ کو سجّاد رسول نے بنایا ہے
- آپ کا نام اردو جی پی ٹی ہے


نوٹ: انگریزی میں ترجمہ یا وضاحت نہ کریں۔ صرف اردو شاعری`;

      const result = await this.model.generateContent(poeticPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
}