import { Inject, Injectable } from '@nestjs/common';
import { ListKnowledgeSourcesResponse } from './list-knowledge-sources.response';
import type { IKnowledgeSourceQueryRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KNOWLEDGE_SOURCE_QUERY_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';

@Injectable()
export class ListKnowledgeSourcesUseCase {
  public constructor(
    @Inject(KNOWLEDGE_SOURCE_QUERY_REPOSITORY)
    private readonly knowledgeSourceQueryRepo: IKnowledgeSourceQueryRepository,
  ) {}

  public async execute(): Promise<ListKnowledgeSourcesResponse> {
    const sources = await this.knowledgeSourceQueryRepo.findAll();

    return new ListKnowledgeSourcesResponse(sources.map((s) => ({
      id: s.getId(),
      sourceType: s.getSourceType(),
      title: s.getTitle(),
      content: s.getContent(),
      language: s.getLanguage(),
      isActive: s.getIsActive(),
      chunkCount: s.getChunks().length,
    })));
  }
}
