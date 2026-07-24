import { Inject, Injectable } from '@nestjs/common';
import type { IAIService } from '../../application/ports/ai-service.interface';
import { AI_SERVICE } from '../../application/ports/ai-service.interface';
import type { IKnowledgeChunkCommandRepository } from '../../domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import { KNOWLEDGE_CHUNK_COMMAND_REPOSITORY } from '../../domain/knowledge-source/repositories/knowledge-chunk-command.repository.interface';
import type { IKnowledgeIngestionService } from '../../application/ports/knowledge-ingestion-service.interface';
import type { IUuidGenerator } from '../../../../shared/modules/uuid/domain/uuid-generator.interface';
import { KnowledgeChunk } from '../../domain/knowledge-source/entities/knowledge-chunk.entity';
import type { KnowledgeSource } from '../../domain/knowledge-source/knowledge-source.aggregate';

@Injectable()
export class TextChunkingIngestionService implements IKnowledgeIngestionService {
  public constructor(
    @Inject(AI_SERVICE)
    private readonly aiService: IAIService,
    @Inject(KNOWLEDGE_CHUNK_COMMAND_REPOSITORY)
    private readonly chunkCommandRepo: IKnowledgeChunkCommandRepository,
    @Inject('UUID_GENERATOR')
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async ingest(source: KnowledgeSource): Promise<void> {
    const textChunks = source.chunkContent(800);

    if (textChunks.length === 0) {
      return;
    }

    const embeddings = await Promise.all(
      textChunks.map((chunk) => this.aiService.generateEmbedding(chunk)),
    );

    const chunks = textChunks.map((content, index) =>
      KnowledgeChunk.create({
        id: this.uuidGenerator.generate(),
        sourceId: source.getId(),
        chunkIndex: index,
        content,
        tokenCount: Math.ceil(content.length / 4),
        embedding: embeddings[index],
      }),
    );

    await this.chunkCommandRepo.insertMany(chunks);
  }
}
