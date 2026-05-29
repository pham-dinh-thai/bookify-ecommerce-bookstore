export class OrderItemPreviewReadModel {
  public constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly imageUrl: string | null,
    public readonly quantity: number,
  ) {}
}
