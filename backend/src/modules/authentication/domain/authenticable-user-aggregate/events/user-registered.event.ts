import { DomainEvent } from '../../../../../shared/domain/domain-event';

export class UserRegistered extends DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly lastName: string,
  ) {
    super();
  }
}
