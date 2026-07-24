export class SessionNotFoundException extends Error {
  constructor() {
    super('Chat session not found.');
  }
}
