export class SessionIdEmptyException extends Error {
  constructor() {
    super('Session ID must not be empty.');
  }
}
