export class FindUsersResponse {
  public constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly gender: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
  ) {}
}
