export class AuthenticableUserReadModel {
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string | null,
    public readonly roleId: string,
    public readonly isActive: boolean,
    public readonly provider: string | null = null,
    public readonly providerId: string | null = null,
  ) {}
}
