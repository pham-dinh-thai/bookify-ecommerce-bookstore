import { DomainEvent } from '../../../../shared/domain/domain-event';

export class BookPriceDecreased extends DomainEvent {
  public constructor(
    public readonly bookId: string,
    public readonly title: string,
    public readonly oldPrice: number,
    public readonly newPrice: number,
  ) {
    super();
  }
}
