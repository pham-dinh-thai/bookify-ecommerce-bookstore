export class ReviewReadModel {
  public constructor(
    public readonly id: string,
    public readonly bookId: string,
    public readonly userId: string,
    public readonly userName: string,
    public readonly rating: number,
    public readonly comment: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
