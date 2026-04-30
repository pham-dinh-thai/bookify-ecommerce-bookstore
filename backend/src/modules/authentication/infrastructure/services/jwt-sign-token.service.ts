import { JwtService } from '@nestjs/jwt';
import { ISignTokenService } from '../../domain/authenticable-user-aggregate/services/sign-token.service';
import { Injectable } from '@nestjs/common';
import { StringValue } from 'ms';

@Injectable()
export class JwtSignTokenService implements ISignTokenService {
  public constructor(private readonly jwtService: JwtService) {}

  public sign(
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: string,
    jti: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as StringValue,
      jwtid: jti,
    });
  }
}
