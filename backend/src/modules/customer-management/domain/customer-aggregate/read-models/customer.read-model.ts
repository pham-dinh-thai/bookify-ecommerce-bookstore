export class CustomerReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly phoneNumber: string,
    public readonly addresses: [],
  ) {}
}
