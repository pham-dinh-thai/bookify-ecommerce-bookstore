import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../cache/domain/cache.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    sub: string;
    roleId: string;
    jti: string;
    exp: number;
  }) {
    const isAccessTokenBlackListed = await this.cache.get<boolean>(
      `blacklist_access_token:${payload.jti}`,
    );

    if (isAccessTokenBlackListed) {
      throw new UnauthorizedException('Access token has been revoked');
    }

    return { id: payload.sub, roleId: payload.roleId };
  }
}
