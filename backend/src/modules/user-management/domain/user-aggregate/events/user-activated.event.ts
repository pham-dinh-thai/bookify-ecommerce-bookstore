import { DomainEvent } from '../../../../../shared/domain/domain-event';

export class UserActivated extends DomainEvent {
  public constructor(public readonly id: string) {
    super();
  }
}
