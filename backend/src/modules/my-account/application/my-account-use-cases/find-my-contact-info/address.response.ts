export class AddressResponse {
  public constructor(
    public readonly id: string,
    public readonly street: string,
    public readonly provinceName: string,
    public readonly wardName: string,
    public readonly isDefault: boolean,
  ) {}
}
