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
      const poeticPrompt = `آپ ایک ماہر اردو شاعر ہیں۔ درج ذیل موضوع پر شاعرانہ جواب تحریر کریں:

"${prompt}"

ضروریات:
- صرف اردو میں جواب دیں
- روایتی اردو شاعری کے اصولوں کی پیروی کریں
- مناسب بحر اور قافیہ کا استعمال کریں
- کم از کم 1-2 مصرعے لکھیں
-  جواب میں ہر مصرعے کی آخری الفاظ ہم آواز ہوں
- ہر مصرعے کو نئی لائن سے شروع کریں
- روزمرہ زندگی سے متعلق استعارے اور تشبیہات کا استعمال کریں
- سادہ اور عام فہم اردو الفاظ کا استعمال کریں
- موضوع سے متعلق ثقافتی حوالے شامل کریں
- جذباتی گہرائی اور معنویت پر توجہ دیں

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