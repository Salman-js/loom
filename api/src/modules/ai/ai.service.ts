import { Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from '../book/dto/create-book.dto';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { prompt } from './entities/ai.entity';

@Injectable()
export class AiService {
  logger = new Logger(AiService.name);

  initializeGemini = (apiKey?: string) => {
    return new GoogleGenerativeAI(apiKey || '');
  };

  async generateDescription(createBookDto: CreateBookDto): Promise<{
    description: string;
    genre: string;
  }> {
    try {
      const book = {
        title: createBookDto.title,
        author: createBookDto.author,
      };
      const gemini = this.initializeGemini(process.env.GEMINI_API_KEY);
      const returnSchema = {
        description: 'Book Description And Genre',
        type: SchemaType.OBJECT,
        properties: {
          genre: {
            type: SchemaType.STRING,
            description:
              'The genre of the book (e.g., Drama, Action, Comedy, etc.)',
          },
          description: {
            type: SchemaType.STRING,
            description: 'A 250-400 word description of the book.',
          },
        },
        required: ['genre', 'description'],
      };
      const model = gemini.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: returnSchema,
        },
      });
      const data = await model.generateContent([prompt, JSON.stringify(book)]);
      const result = data?.response?.text();

      if (!result) {
        throw new Error('No response from Gemini API');
      }

      try {
        const jsonResult = JSON.parse(result);
        if (!jsonResult.genre || !jsonResult.description) {
          throw new Error('Invalid JSON structure received');
        }
        return jsonResult;
      } catch (parseError) {
        this.logger.error('Failed to parse JSON:', parseError);
        throw parseError;
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
