export class OrderWorkloadReadModel {
  public constructor(
    public readonly pendingOrders: number,
    public readonly confirmedOrders: number,
    public readonly deliveringOrders: number,
    public readonly unpaidCodOrders: number,
    public readonly unpaidCompleteCodOrders: number,
  ) {}
}
