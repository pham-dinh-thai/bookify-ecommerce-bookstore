import { ChatSession } from './chat-session/chat-session.aggregate';
import { KnowledgeSource } from './knowledge-source/knowledge-source.aggregate';
import { KnowledgeSourceType } from './knowledge-source/enums/knowledge-source-type.enum';
import type { ProductSearchResult } from '../application/ports/tool-service.interface';

/**
 * ChatBot aggregate root.
 *
 * Pure domain logic only. No repos, no services, no infrastructure.
 * Use cases handle persistence and orchestration.
 */
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
    const base = `You are Bookify's AI customer support assistant for an online bookstore.
You help customers find books, answer questions about orders, shipping, payment, and store policies.
Be helpful, friendly, and concise.
If you don't know the answer, suggest contacting staff.
Always respond in the same language the customer uses.

IMPORTANT: Only use the product data provided below. If no matching products are found, tell the customer that those books are not currently available at Bookify. NEVER fabricate book titles, authors, or prices.`;

    let context = '';

    if (ragChunks.length > 0) {
      context += `Knowledge base context:\n${ragChunks.join('\n\n')}\n\n`;
    }

    if (productResults.length > 0) {
      context += `Matching products from Bookify's catalog:\n${productResults.map((p) => {
        const authors = p.authors.length > 0 ? ` by ${p.authors.join(', ')}` : '';
        return `- "${p.title}"${authors} - ${p.originalPrice} VND, ${p.discountPercentage}% off`;
      }).join('\n')}\n\n`;
    } else {
      context += `No matching products found in Bookify's catalog for this query.\n\n`;
    }

    return context ? `${base}\n\n${context}` : base;
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
