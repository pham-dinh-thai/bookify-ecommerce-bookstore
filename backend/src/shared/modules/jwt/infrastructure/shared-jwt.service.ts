import { Injectable } from '@nestjs/common';
import { IJwtService } from '../domain/jwt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SharedJwtService implements IJwtService {
  public constructor(private readonly jwtService: JwtService) {}

  public verify(token: string, secret: string): Record<string, unknown> {
    return this.jwtService.verify(token, { secret });
  }
}
