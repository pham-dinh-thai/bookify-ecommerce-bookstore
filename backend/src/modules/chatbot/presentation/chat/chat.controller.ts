import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { CreateSessionUseCase } from '../../application/chatbot-use-cases/create-session/create-session.use-case';
import { CreateSessionRequest } from './requests/create-session.request';
import { CreateSessionResponse } from '../../application/chatbot-use-cases/create-session/create-session.response';
import { SendMessageUseCase } from '../../application/chatbot-use-cases/send-message/send-message.use-case';
import { SendMessageRequest } from './requests/send-message.request';
import { SendMessageResponse } from '../../application/chatbot-use-cases/send-message/send-message.response';
import { GetHistoryUseCase } from '../../application/chatbot-use-cases/get-history/get-history.use-case';
import { GetHistoryResponse } from '../../application/chatbot-use-cases/get-history/get-history.response';
import { ListSessionsUseCase } from '../../application/chatbot-use-cases/list-sessions/list-sessions.use-case';
import { ListSessionsResponse } from '../../application/chatbot-use-cases/list-sessions/list-sessions.response';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  public constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getHistoryUseCase: GetHistoryUseCase,
    private readonly listSessionsUseCase: ListSessionsUseCase,
  ) {}

  @Post('sessions')
  public async createSession(
    @Body() request: CreateSessionRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<CreateSessionResponse> {
    return this.createSessionUseCase.execute(request, userId);
  }

  @Get('sessions')
  public async listSessions(
    @CurrentUser('userId') userId: string,
  ): Promise<ListSessionsResponse> {
    return this.listSessionsUseCase.execute(userId);
  }

  @Get('sessions/:id/messages')
  public async getHistory(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<GetHistoryResponse> {
    return this.getHistoryUseCase.execute(id, userId);
  }

  @Post('sessions/:id/messages')
  public async sendMessage(
    @Param('id') id: string,
    @Body() request: SendMessageRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<SendMessageResponse> {
    return this.sendMessageUseCase.execute(id, request, userId);
  }
}
