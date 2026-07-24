import { KnowledgeSource } from '../../domain/knowledge-source/knowledge-source.aggregate';
import { KnowledgeSourceTypeOrm } from '../entities/knowledge-source.entity';
import { KnowledgeChunkTypeOrm } from '../entities/knowledge-chunk.entity';
import { KnowledgeChunk } from '../../domain/knowledge-source/entities/knowledge-chunk.entity';
import { KnowledgeSourceReadModel } from '../../domain/knowledge-source/read-models/knowledge-source.read-model';

export class KnowledgeMapper {
  public static sourceToDomain(
    entity: KnowledgeSourceTypeOrm,
    chunks?: KnowledgeChunkTypeOrm[],
  ): KnowledgeSource {
    return KnowledgeSource.fromPersistent({
      id: entity.id,
      sourceType: entity.sourceType,
      title: entity.title,
      content: entity.content,
      language: entity.language,
      isActive: entity.isActive,
      chunks: (chunks ?? []).map((c) =>
        KnowledgeChunk.fromPersistent({
          id: c.id,
          sourceId: c.sourceId,
          chunkIndex: c.chunkIndex,
          content: c.content,
          tokenCount: c.tokenCount,
          embedding: c.embedding,
        }),
      ),
    });
  }

  public static sourceToTypeOrm(source: KnowledgeSource): KnowledgeSourceTypeOrm {
    const entity = new KnowledgeSourceTypeOrm();

    entity.id = source.getId();
    entity.sourceType = source.getSourceType();
    entity.title = source.getTitle();
    entity.content = source.getContent();
    entity.language = source.getLanguage();
    entity.isActive = source.getIsActive();

    return entity;
  }

  public static chunkToTypeOrm(
    chunk: KnowledgeChunk,
  ): KnowledgeChunkTypeOrm {
    const entity = new KnowledgeChunkTypeOrm();

    entity.id = chunk.getId();
    entity.sourceId = chunk.getSourceId();
    entity.chunkIndex = chunk.getChunkIndex();
    entity.content = chunk.getContent();
    entity.tokenCount = chunk.getTokenCount();
    entity.embedding = chunk.getEmbedding();

    return entity;
  }

  public static sourceToReadModel(
    entity: KnowledgeSourceTypeOrm,
  ): KnowledgeSourceReadModel {
    return new KnowledgeSourceReadModel(
      entity.id,
      entity.sourceType,
      entity.title,
      entity.content,
      entity.language,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
