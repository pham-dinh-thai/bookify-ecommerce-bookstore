export class CreateSessionResponse {
  constructor(
    public readonly sessionId: string,
    public readonly title: string,
  ) {}
}
