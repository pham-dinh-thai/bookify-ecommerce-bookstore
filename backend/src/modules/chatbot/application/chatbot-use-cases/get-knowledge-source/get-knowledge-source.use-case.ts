import { Inject, Injectable } from '@nestjs/common';
import { GetKnowledgeSourceResponse } from './get-knowledge-source.response';
import type { IKnowledgeSourceQueryRepository } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KNOWLEDGE_SOURCE_QUERY_REPOSITORY } from '../../../domain/knowledge-source/repositories/knowledge-source-query.repository.interface';
import { KnowledgeSourceNotFoundException } from '../../../domain/exceptions/knowledge-source-not-found.exception';

@Injectable()
export class GetKnowledgeSourceUseCase {
  public constructor(
    @Inject(KNOWLEDGE_SOURCE_QUERY_REPOSITORY)
    private readonly knowledgeSourceQueryRepo: IKnowledgeSourceQueryRepository,
  ) {}

  public async execute(id: string): Promise<GetKnowledgeSourceResponse> {
    const source = await this.knowledgeSourceQueryRepo.findOne(id);

    if (!source) {
      throw new KnowledgeSourceNotFoundException();
    }

    return new GetKnowledgeSourceResponse({
      id: source.getId(),
      sourceType: source.getSourceType(),
      title: source.getTitle(),
      content: source.getContent(),
      language: source.getLanguage(),
      isActive: source.getIsActive(),
      chunkCount: source.getChunks().length,
    });
  }
}
