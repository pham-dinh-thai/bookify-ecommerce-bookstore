export interface IAIService {
  generateEmbedding(text: string): Promise<number[]>;
  chat(params: {
    systemPrompt: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  }): Promise<string>;
  chatStream(params: {
    systemPrompt: string;
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
    onChunk: (chunk: string) => void;
  }): Promise<void>;
}

export const AI_SERVICE = 'IAIService';
