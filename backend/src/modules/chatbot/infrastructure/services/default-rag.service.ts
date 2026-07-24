import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IAIService } from '../../application/ports/ai-service.interface';
import { AI_SERVICE } from '../../application/ports/ai-service.interface';
import type { IKnowledgeSourceQueryRepository } from '../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KNOWLEDGE_SOURCE_QUERY_REPOSITORY } from '../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import type { IRAGService } from '../../application/ports/rag-service.interface';

@Injectable()
export class DefaultRAGService implements IRAGService {
  public constructor(
    @Inject(AI_SERVICE)
    private readonly aiService: IAIService,
    @Inject(KNOWLEDGE_SOURCE_QUERY_REPOSITORY)
    private readonly knowledgeSourceQueryRepo: IKnowledgeSourceQueryRepository,
    private readonly configService: ConfigService,
  ) {}

  public async retrieveRelevantChunks(query: string): Promise<string[]> {
    const topK = this.configService.get<number>('CHATBOT_RAG_TOP_K', 5);

    const queryEmbedding = await this.aiService.generateEmbedding(query);

    const sources =
      await this.knowledgeSourceQueryRepo.findActiveByLanguage('vi');

    const allChunks: string[] = [];

    for (const source of sources) {
      const chunks = source.findRelevantChunks(queryEmbedding, topK);
      allChunks.push(...chunks);
    }

    return allChunks.slice(0, topK);
  }
}
