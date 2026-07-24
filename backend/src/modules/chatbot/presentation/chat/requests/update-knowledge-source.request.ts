import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { IUpdateKnowledgeSourceRequest } from '../../../application/chatbot-use-cases/update-knowledge-source/update-knowledge-source.request';
import { KnowledgeSourceType } from '../../../domain/knowledge-source/enums/knowledge-source-type.enum';

export class UpdateKnowledgeSourceRequest implements IUpdateKnowledgeSourceRequest {
  @IsEnum(KnowledgeSourceType)
  @IsOptional()
  sourceType?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsOptional()
  isActive?: boolean;
}
