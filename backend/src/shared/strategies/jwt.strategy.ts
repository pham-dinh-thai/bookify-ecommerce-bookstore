import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../cache/domain/cache.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {
    const secret = process.env.JWT_SECRET!;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  public async validate(payload: {
    sub: string;
    roleId: string;
    jti?: string;
    sessionId: string;
    exp: number;
  }): Promise<{
    userId: string;
    roleId: string;
    jti: string;
    sessionId: string;
    exp: number;
  }> {
    if (!payload.jti) {
      throw new UnauthorizedException('Access token does not contain jti');
    }

    const isAccessTokenBlacklisted = await this.cache.get<boolean>(
      `blacklist_access_token:${payload.jti}`,
    );

    if (isAccessTokenBlacklisted) {
      throw new UnauthorizedException('Access token has been revoked');
    }

    return {
      userId: payload.sub,
      roleId: payload.roleId,
      jti: payload.jti,
      sessionId: payload.sessionId,
      exp: payload.exp,
    };
  }
}
