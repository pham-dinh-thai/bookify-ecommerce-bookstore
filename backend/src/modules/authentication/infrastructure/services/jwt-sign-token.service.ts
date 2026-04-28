import { JwtService } from '@nestjs/jwt';
import { ISignTokenService } from '../../domain/authenticable-user-aggregate/services/sign-token.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtSignTokenService implements ISignTokenService {
  public constructor(private readonly jwtService: JwtService) {}

  public sign(sub: string, roleId: string): string {
    return this.jwtService.sign({
      sub: sub,
      roleId: roleId,
    });
  }
}
