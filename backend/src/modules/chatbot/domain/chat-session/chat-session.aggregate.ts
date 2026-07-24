import { MessageRole } from './enums/message-role.enum';
import { ChatMessage } from './entities/chat-message.entity';

/**
 * ChatSession aggregate.
 *
 * Pure domain logic only. No repos, no services, no infrastructure.
 */
export class ChatSession {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private title: string,
    private readonly messages: ChatMessage[],
  ) {}

  public static create(props: {
    id: string;
    userId: string;
    title?: string;
  }): ChatSession {
    if (!props.id) {
      throw new Error('Session ID must not be empty.');
    }

    if (!props.userId) {
      throw new Error('User ID must not be empty.');
    }

    return new ChatSession(
      props.id,
      props.userId,
      props.title ?? 'Cuộc trò chuyện mới',
      [],
    );
  }

  public static fromPersistent(props: {
    id: string;
    userId: string;
    title: string;
    messages: ChatMessage[];
  }): ChatSession {
    return new ChatSession(
      props.id,
      props.userId,
      props.title,
      props.messages,
    );
  }

  public addMessage(
    id: string,
    content: string,
    role: MessageRole,
  ): ChatMessage {
    const message = ChatMessage.create({
      id,
      sessionId: this.id,
      content,
      role,
    });

    this.messages.push(message);

    return message;
  }

  public getRecentMessages(limit: number = 10): ChatMessage[] {
    return this.messages.slice(-limit);
  }

  public updateTitle(title: string): void {
    this.title = title;
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getMessages(): ChatMessage[] {
    return [...this.messages];
  }
}
