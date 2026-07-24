import { ChatSessionReadModel } from '../../../domain/chat-session/read-models/chat-session.read-model';

export class ListSessionsResponse {
  constructor(
    public readonly sessions: ChatSessionReadModel[],
  ) {}
}
