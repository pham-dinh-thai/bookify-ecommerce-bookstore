import { DomainEvent } from '../../../../../shared/domain/domain-event';

export class OrderDeliveryStarted extends DomainEvent {
  public constructor(
    public readonly orderId: string,
    public readonly orderCode: string,
    public readonly customerEmail: string,
    public readonly customerName: string,
  ) {
    super();
  }
}
