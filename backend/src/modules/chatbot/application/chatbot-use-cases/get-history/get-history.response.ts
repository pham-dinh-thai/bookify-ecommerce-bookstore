import { ChatSessionDetailReadModel } from '../../../domain/chat-session/read-models/chat-session.read-model';

export class GetHistoryResponse {
  constructor(
    public readonly session: ChatSessionDetailReadModel,
  ) {}
}
