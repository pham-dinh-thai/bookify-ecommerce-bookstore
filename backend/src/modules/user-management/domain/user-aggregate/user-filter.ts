export class UserFilter {
  public constructor(
    public readonly roleId?: string,
    public readonly excludeRoleId?: string,
    public readonly isActive?: boolean,
  ) {}
}
