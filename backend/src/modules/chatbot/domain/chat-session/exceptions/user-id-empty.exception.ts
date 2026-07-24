export class UserIdEmptyException extends Error {
  constructor() {
    super('User ID must not be empty.');
  }
}
