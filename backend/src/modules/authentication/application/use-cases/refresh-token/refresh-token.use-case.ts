import { Inject, Injectable } from '@nestjs/common';
import {
  type ISignTokenService,
  SIGN_TOKEN_SERVICE,
} from '../../../domain/authenticable-user-aggregate/services/sign-token.service';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  type IRefreshTokenHasherService,
  REFRESH_TOKEN_HASHER,
} from '../../../domain/authenticable-user-aggregate/services/refresh-token-hasher.service';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  JWt_SERVICE,
  type IJwtService,
} from '../../../../../shared/modules/jwt/domain/jwt.service';
import { RefreshTokenNotFoundOrExpiredException } from '../../../domain/authenticable-user-aggregate/exceptions/refresh-token-not-found-or-expired.exception';
import { RefreshTokenInvalidException } from '../../../domain/authenticable-user-aggregate/exceptions/refresh-token-invalid.exception';

@Injectable()
export class RefreshTokenUseCase {
  public constructor(
    @Inject(SIGN_TOKEN_SERVICE)
    private readonly signTokenService: ISignTokenService,

    @Inject(JWt_SERVICE)
    private readonly sharedJwt: IJwtService,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,

    @Inject(REFRESH_TOKEN_HASHER)
    private readonly refreshTokenHasher: IRefreshTokenHasherService,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,
  ) {}

  public async execute(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const payload = this.sharedJwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    );

    const userId = payload.sub as string;
    const roleId = payload.roleId as string;
    const sessionId = payload.sessionId as string;

    // Get hashed refresh token from Redis
    const storedHash = await this.cache.get<string>(
      `refresh_token:${userId}:${sessionId}`,
    );

    if (!storedHash) {
      throw new RefreshTokenNotFoundOrExpiredException();
    }

    // Verify hashed token
    const isValid = this.refreshTokenHasher.verify(refreshToken, storedHash);

    if (!isValid) {
      throw new RefreshTokenInvalidException();
    }

    // Issue new token
    const accessTokenId = this.uuid.generate();
    const accessToken = this.signTokenService.sign(
      {
        sub: userId,
        roleId: roleId,
        sessionId: sessionId,
      },
      process.env.JWT_SECRET!,
      '15m',
      accessTokenId,
    );

    return { accessToken };
  }
}
