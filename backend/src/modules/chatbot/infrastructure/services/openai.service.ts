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
export class OpenAIService implements IAIService {
  private readonly logger = new Logger(OpenAIService.name);
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
    try {
      const response = await this.client.embeddings.create({
        model: this.configService.get<string>(
          'OPENAI_EMBEDDING_MODEL',
          'text-embedding-ada-002',
        ),
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      this.logger.error('Failed to generate embedding', error);
      throw this.wrapError(error);
    }
  }

  public async chat(params: {
    systemPrompt: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: this.maxTokens,
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
      const stream = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: this.maxTokens,
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
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return new AIQuotaExceededException();
      }

      if (error.status === 504 || error.code === 'ETIMEDOUT') {
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
