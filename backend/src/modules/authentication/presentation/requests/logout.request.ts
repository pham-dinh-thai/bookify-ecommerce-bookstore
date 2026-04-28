import { IsString } from 'class-validator';
import { ILogoutRequest } from '../../application/use-cases/logout/logout.request';

export class LogoutRequest implements ILogoutRequest {
  @IsString()
  public readonly userId!: string;

  @IsString()
  public readonly jti!: string;

  @IsString()
  public readonly exp!: number;

  public constructor(userId: string, jti: string, exp: number) {
    this.userId = userId;
    this.jti = jti;
    this.exp = exp;
  }
}
