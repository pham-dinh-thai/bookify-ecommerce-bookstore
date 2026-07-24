import { MessageRole } from '../enums/message-role.enum';

export class ChatMessageReadModel {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly role: MessageRole,
    public readonly content: string,
    public readonly metadata: Record<string, unknown> | null,
    public readonly createdAt: Date,
  ) {}
}
