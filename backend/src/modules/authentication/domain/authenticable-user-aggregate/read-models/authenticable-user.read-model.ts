export class AuthenticableUserReadModel {
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
  ) {}
}
