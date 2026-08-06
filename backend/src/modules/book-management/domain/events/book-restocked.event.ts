import { DomainEvent } from '../../../../shared/domain/domain-event';

export class BookRestocked extends DomainEvent {
  public constructor(
    public readonly bookId: string,
    public readonly title: string,
    public readonly quantity: number,
  ) {
    super();
  }
}
