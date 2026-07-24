export interface IAIService {
  generateEmbedding(text: string): Promise<number[]>;
  chat(params: {
    systemPrompt: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  }): Promise<string>;
}

export const AI_SERVICE = 'IAIService';
