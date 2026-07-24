import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { IAIService } from '../../application/ports/ai-service.interface';

@Injectable()
export class OpenAIService implements IAIService {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly maxTokens: number;

  public constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.model = this.configService.get<string>(
      'OPENAI_MODEL',
      'gpt-4o-mini',
    );
    this.maxTokens = this.configService.get<number>(
      'CHATBOT_MAX_TOKENS',
      1024,
    );
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: this.configService.get<string>(
        'OPENAI_EMBEDDING_MODEL',
        'text-embedding-ada-002',
      ),
      input: text,
    });

    return response.data[0].embedding;
  }

  public async chat(params: {
    systemPrompt: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  }): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: this.maxTokens,
      messages: [
        { role: 'system', content: params.systemPrompt },
        ...params.messages,
      ],
    });

    return response.choices[0].message.content ?? '';
  }
}
