export class OauthLoginResponse {
  public constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly roleId: string,
    public readonly isNewUser: boolean,
  ) {}
}
