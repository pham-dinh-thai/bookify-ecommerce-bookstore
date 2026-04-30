import { DomainEvent } from '../../../../../shared/domain/domain-event';

export class UserUpdated extends DomainEvent {
  public constructor(public readonly id: string) {
    super();
  }
}
