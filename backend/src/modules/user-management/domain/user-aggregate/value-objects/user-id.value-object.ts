import { UserIdEmptyException } from '../exceptions/user-id-empty.exception';

export class UserId {
  private constructor(private readonly value: string) {
    if (!this.value) {
      throw new UserIdEmptyException();
    }
  }

  public static create(value: string): UserId {
    return new UserId(value);
  }

  public getValue(): string {
    return this.value;
  }
}
