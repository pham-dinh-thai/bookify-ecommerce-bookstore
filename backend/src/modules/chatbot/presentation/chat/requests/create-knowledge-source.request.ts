import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { ICreateKnowledgeSourceRequest } from '../../../application/chatbot-use-cases/create-knowledge-source/create-knowledge-source.request';
import { KnowledgeSourceType } from '../../../domain/knowledge-source/enums/knowledge-source-type.enum';

export class CreateKnowledgeSourceRequest implements ICreateKnowledgeSourceRequest {
  @IsEnum(KnowledgeSourceType)
  @IsNotEmpty()
  sourceType!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsOptional()
  language?: string;
}
