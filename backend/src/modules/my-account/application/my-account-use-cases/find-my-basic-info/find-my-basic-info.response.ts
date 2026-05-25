export class FindMyBasicInfoResponse {
  public constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: string,
    public readonly email: string,
  ) {}
}
