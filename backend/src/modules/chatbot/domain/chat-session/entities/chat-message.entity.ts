import { MessageRole } from '../enums/message-role.enum';

export class ChatMessage {
  private constructor(
    private readonly id: string,
    private readonly sessionId: string,
    private readonly content: string,
    private readonly role: MessageRole,
    private readonly metadata: Record<string, unknown> | null,
  ) {}

  public static create(props: {
    id: string;
    sessionId: string;
    content: string;
    role: MessageRole;
    metadata?: Record<string, unknown>;
  }): ChatMessage {
    return new ChatMessage(
      props.id,
      props.sessionId,
      props.content,
      props.role,
      props.metadata ?? null,
    );
  }

  public static fromPersistent(props: {
    id: string;
    sessionId: string;
    content: string;
    role: MessageRole;
    metadata: Record<string, unknown> | null;
  }): ChatMessage {
    return new ChatMessage(
      props.id,
      props.sessionId,
      props.content,
      props.role,
      props.metadata,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getContent(): string {
    return this.content;
  }

  public getRole(): MessageRole {
    return this.role;
  }

  public getMetadata(): Record<string, unknown> | null {
    return this.metadata;
  }
}
