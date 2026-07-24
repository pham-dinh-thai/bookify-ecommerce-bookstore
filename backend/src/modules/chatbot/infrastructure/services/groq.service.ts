import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { IAIService } from '../../application/ports/ai-service.interface';
import {
  AIQuotaExceededException,
  AITimeoutException,
  AIServiceException,
} from '../../domain/exceptions/ai-service.exception';

@Injectable()
export class GroqAIService implements IAIService {
  private readonly logger = new Logger(GroqAIService.name);
  private client: OpenAI | null = null;

  public constructor(private readonly configService: ConfigService) {}

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = this.configService.get<string>('GROQ_API_KEY');
      if (!apiKey) {
        throw new AIServiceException(
          'GROQ_API_KEY is not configured. AI features are unavailable.',
        );
      }
      this.client = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
    }
    return this.client;
  }

  private getModel(): string {
    return this.configService.get<string>('GROQ_MODEL', 'llama-3.3-70b-versatile');
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const vector = new Array(256).fill(0);
    const lower = text.toLowerCase();

    for (let i = 0; i < lower.length - 1; i++) {
      const bigram = lower[i] + lower[i + 1];
      let hash = 0;
      for (let j = 0; j < bigram.length; j++) {
        hash = ((hash << 5) - hash + bigram.charCodeAt(j)) | 0;
      }
      vector[Math.abs(hash) % 256] += 1;
    }

    const norm = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
    if (norm === 0) return vector;
    return vector.map((v) => v / norm);
  }

  public async chat(params: {
    systemPrompt: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  }): Promise<string> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: this.getModel(),
        max_tokens: this.configService.get<number>('CHATBOT_MAX_TOKENS', 1024),
        messages: [
          { role: 'system', content: params.systemPrompt },
          ...params.messages,
        ],
      });

      return response.choices[0].message.content ?? '';
    } catch (error) {
      this.logger.error('Failed to chat with AI', error);
      throw this.wrapError(error);
    }
  }

  public async chatStream(params: {
    systemPrompt: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
    onChunk: (chunk: string) => void;
  }): Promise<void> {
    try {
      const stream = await this.getClient().chat.completions.create({
        model: this.getModel(),
        max_tokens: this.configService.get<number>('CHATBOT_MAX_TOKENS', 1024),
        stream: true,
        messages: [
          { role: 'system', content: params.systemPrompt },
          ...params.messages,
        ],
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;

        if (content) {
          params.onChunk(content);
        }
      }
    } catch (error) {
      this.logger.error('Failed to stream chat with AI', error);
      throw this.wrapError(error);
    }
  }

  private wrapError(error: unknown): Error {
    if (error instanceof Error && 'status' in error) {
      const status = (error as { status: number }).status;

      if (status === 429) {
        return new AIQuotaExceededException();
      }

      if (status === 504) {
        return new AITimeoutException();
      }
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return new AITimeoutException();
    }

    return new AIServiceException(
      error instanceof Error ? error.message : 'Unknown AI service error',
      error,
    );
  }
}
