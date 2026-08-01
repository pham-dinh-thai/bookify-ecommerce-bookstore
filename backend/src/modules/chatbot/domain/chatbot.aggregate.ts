import { ChatSession } from './chat-session/chat-session.aggregate';
import { KnowledgeSource } from './knowledge-source/knowledge-source.aggregate';
import { KnowledgeSourceType } from './knowledge-source/enums/knowledge-source-type.enum';
import type { ProductSearchResult } from '../application/ports/tool-service.interface';
import { SYSTEM_PROMPT } from './system-prompt';

export class ChatBot {
  public createSession(
    id: string,
    userId: string,
    title?: string,
  ): ChatSession {
    return ChatSession.create({ id, userId, title });
  }

  public buildSystemPrompt(
    ragChunks: string[],
    productResults: ProductSearchResult[],
  ): string {
    let context = '';

    if (ragChunks.length > 0) {
      context += `Knowledge base context:\n${ragChunks.join('\n\n')}\n\n`;
    }

    if (productResults.length > 0) {
      context += `Matching products from Bookify's catalog:\n${productResults
        .map((p) => {
          const authors =
            p.authors.length > 0 ? ` by ${p.authors.join(', ')}` : '';
          return `- "${p.title}"${authors} - ${p.originalPrice} VND, ${p.discountPercentage}% off`;
        })
        .join('\n')}\n\n`;
    } else {
      context += `No matching products found in Bookify's catalog for this query.\n\n`;
    }

    return context ? `${SYSTEM_PROMPT}\n\n${context}` : SYSTEM_PROMPT;
  }

  public createKnowledgeSource(
    id: string,
    sourceType: string,
    title: string,
    content: string,
    language?: string,
  ): KnowledgeSource {
    return KnowledgeSource.create({
      id,
      sourceType: sourceType as KnowledgeSourceType,
      title,
      content,
      language,
    });
  }
}
