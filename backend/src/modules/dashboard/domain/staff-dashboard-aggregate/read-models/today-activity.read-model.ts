export class TodayActivityReadModel {
  public constructor(
    public readonly ordersPlacedToday: number,
    public readonly ordersConfirmedToday: number,
    public readonly ordersDeliveredToday: number,
    public readonly ordersCompletedToday: number,
    public readonly ordersCanceledToday: number,
  ) {}
}
