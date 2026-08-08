import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../../../shared/http/guards/optional-jwt-auth.guard';
import { CurrentUserId } from '../../../../shared/http/decorators/current-user-id.decorator';
import { CreateSessionUseCase } from '../../application/chatbot-use-cases/create-session/create-session.use-case';
import { CreateSessionRequest } from './requests/create-session.request';
import { CreateSessionResponse } from '../../application/chatbot-use-cases/create-session/create-session.response';
import { SendMessageUseCase } from '../../application/chatbot-use-cases/send-message/send-message.use-case';
import { SendMessageRequest } from './requests/send-message.request';
import { SendMessageResponse } from '../../application/chatbot-use-cases/send-message/send-message.response';
import { SendMessageStreamUseCase } from '../../application/chatbot-use-cases/send-message-stream/send-message-stream.use-case';
import { GetHistoryUseCase } from '../../application/chatbot-use-cases/get-history/get-history.use-case';
import { GetHistoryResponse } from '../../application/chatbot-use-cases/get-history/get-history.response';
import { ListSessionsUseCase } from '../../application/chatbot-use-cases/list-sessions/list-sessions.use-case';
import { ListSessionsResponse } from '../../application/chatbot-use-cases/list-sessions/list-sessions.response';
import { DeleteSessionUseCase } from '../../application/chatbot-use-cases/delete-session/delete-session.use-case';
import { UpdateSessionTitleUseCase } from '../../application/chatbot-use-cases/update-session-title/update-session-title.use-case';
import { UpdateSessionTitleRequest } from './requests/update-session-title.request';
import { UpdateSessionTitleResponse } from '../../application/chatbot-use-cases/update-session-title/update-session-title.response';
import { CreateKnowledgeSourceUseCase } from '../../application/chatbot-use-cases/create-knowledge-source/create-knowledge-source.use-case';
import { CreateKnowledgeSourceRequest } from './requests/create-knowledge-source.request';
import { CreateKnowledgeSourceResponse } from '../../application/chatbot-use-cases/create-knowledge-source/create-knowledge-source.response';
import { ListKnowledgeSourcesUseCase } from '../../application/chatbot-use-cases/list-knowledge-sources/list-knowledge-sources.use-case';
import { ListKnowledgeSourcesResponse } from '../../application/chatbot-use-cases/list-knowledge-sources/list-knowledge-sources.response';
import { GetKnowledgeSourceUseCase } from '../../application/chatbot-use-cases/get-knowledge-source/get-knowledge-source.use-case';
import { GetKnowledgeSourceResponse } from '../../application/chatbot-use-cases/get-knowledge-source/get-knowledge-source.response';
import { UpdateKnowledgeSourceUseCase } from '../../application/chatbot-use-cases/update-knowledge-source/update-knowledge-source.use-case';
import { UpdateKnowledgeSourceRequest } from './requests/update-knowledge-source.request';
import { UpdateKnowledgeSourceResponse } from '../../application/chatbot-use-cases/update-knowledge-source/update-knowledge-source.response';
import { DeleteKnowledgeSourceUseCase } from '../../application/chatbot-use-cases/delete-knowledge-source/delete-knowledge-source.use-case';
@Controller('chat')
@UseGuards(OptionalJwtAuthGuard)
export class ChatController {
  public constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly sendMessageStreamUseCase: SendMessageStreamUseCase,
    private readonly getHistoryUseCase: GetHistoryUseCase,
    private readonly listSessionsUseCase: ListSessionsUseCase,
    private readonly deleteSessionUseCase: DeleteSessionUseCase,
    private readonly updateSessionTitleUseCase: UpdateSessionTitleUseCase,
    private readonly createKnowledgeSourceUseCase: CreateKnowledgeSourceUseCase,
    private readonly listKnowledgeSourcesUseCase: ListKnowledgeSourcesUseCase,
    private readonly getKnowledgeSourceUseCase: GetKnowledgeSourceUseCase,
    private readonly updateKnowledgeSourceUseCase: UpdateKnowledgeSourceUseCase,
    private readonly deleteKnowledgeSourceUseCase: DeleteKnowledgeSourceUseCase,
  ) {}

  @Post('sessions')
  public async createSession(
    @Body() request: CreateSessionRequest,
    @CurrentUserId() userId: string,
  ): Promise<CreateSessionResponse> {
    return this.createSessionUseCase.execute(request, userId);
  }

  @Get('sessions')
  public async listSessions(
    @CurrentUserId() userId: string,
  ): Promise<ListSessionsResponse> {
    return this.listSessionsUseCase.execute(userId);
  }

  @Get('sessions/:id/messages')
  public async getHistory(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<GetHistoryResponse> {
    return this.getHistoryUseCase.execute(id, userId);
  }

  @Post('sessions/:id/messages')
  public async sendMessage(
    @Param('id') id: string,
    @Body() request: SendMessageRequest,
    @CurrentUserId() userId: string,
  ): Promise<SendMessageResponse> {
    return this.sendMessageUseCase.execute(id, request, userId);
  }

  @Post('sessions/:id/messages/stream')
  public async sendMessageStream(
    @Param('id') id: string,
    @Body() request: SendMessageRequest,
    @CurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    try {
      await this.sendMessageStreamUseCase.execute(
        id,
        request,
        userId,
        (chunk) => {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        },
      );
      res.write('data: [DONE]\n\n');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Stream error';
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    } finally {
      res.end();
    }
  }

  @Patch('sessions/:id')
  public async updateSessionTitle(
    @Param('id') id: string,
    @Body() request: UpdateSessionTitleRequest,
    @CurrentUserId() userId: string,
  ): Promise<UpdateSessionTitleResponse> {
    return this.updateSessionTitleUseCase.execute(id, userId, request);
  }

  @Delete('sessions/:id')
  public async deleteSession(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    return this.deleteSessionUseCase.execute(id, userId);
  }

  @Post('knowledge')
  @UseGuards(JwtAuthGuard)
  public async createKnowledgeSource(
    @Body() request: CreateKnowledgeSourceRequest,
  ): Promise<CreateKnowledgeSourceResponse> {
    return this.createKnowledgeSourceUseCase.execute(request);
  }

  @Get('knowledge')
  @UseGuards(JwtAuthGuard)
  public async listKnowledgeSources(): Promise<ListKnowledgeSourcesResponse> {
    return this.listKnowledgeSourcesUseCase.execute();
  }

  @Get('knowledge/:id')
  @UseGuards(JwtAuthGuard)
  public async getKnowledgeSource(
    @Param('id') id: string,
  ): Promise<GetKnowledgeSourceResponse> {
    return this.getKnowledgeSourceUseCase.execute(id);
  }

  @Patch('knowledge/:id')
  @UseGuards(JwtAuthGuard)
  public async updateKnowledgeSource(
    @Param('id') id: string,
    @Body() request: UpdateKnowledgeSourceRequest,
  ): Promise<UpdateKnowledgeSourceResponse> {
    return this.updateKnowledgeSourceUseCase.execute(id, request);
  }

  @Delete('knowledge/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteKnowledgeSource(@Param('id') id: string): Promise<void> {
    return this.deleteKnowledgeSourceUseCase.execute(id);
  }
}
