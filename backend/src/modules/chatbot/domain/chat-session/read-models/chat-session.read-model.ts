import { ChatMessageReadModel } from './chat-message.read-model';

export class ChatSessionReadModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class ChatSessionDetailReadModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly messages: ChatMessageReadModel[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
