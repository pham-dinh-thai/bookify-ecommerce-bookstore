import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHENTICABLE_USER_QUERY_REPOSITORY,
  type IAuthenticableUserQueryRepository,
} from '../../../domain/authenticable-user-aggregate/repositories/authenticable-user-query.repository.interface';
import { ILoginRequest } from './login.request';
import { Password } from '../../../../../shared/domain/value-objects/password/password.value-object';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  SIGN_TOKEN_SERVICE,
  type ISignTokenService,
} from '../../../domain/authenticable-user-aggregate/services/sign-token.service';
import {
  type IRefreshTokenHasherService,
  REFRESH_TOKEN_HASHER,
} from '../../../domain/authenticable-user-aggregate/services/refresh-token-hasher.service';
import { LoginFailedException } from '../../../domain/authenticable-user-aggregate/exceptions/login-failed.exception';

@Injectable()
export class LoginUseCase {
  private static DUMMY_HASH =
    '$2y$10$usesomesillystringfore7hnbRJHxXVLeakoG8K30oukPsA.ztMG'; // Using fake hash to prevents timing attacks

  public constructor(
    @Inject(AUTHENTICABLE_USER_QUERY_REPOSITORY)
    private readonly repository: IAuthenticableUserQueryRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,

    @Inject(SIGN_TOKEN_SERVICE)
    private readonly signTokenService: ISignTokenService,

    @Inject(REFRESH_TOKEN_HASHER)
    private readonly refreshTokenHasher: IRefreshTokenHasherService,
  ) {}

  public async execute(request: ILoginRequest): Promise<{
    accessToken: string;
    refreshToken: string;
    roleId: string;
  } | null> {
    const authUser = await this.repository.findByEmail(request.email);

    const password = authUser ? authUser.password : LoginUseCase.DUMMY_HASH;

    const isVerify = await Password.fromHashed(password).compare(
      request.password,
    );

    if (!isVerify || !authUser) {
      throw new LoginFailedException();
    }

    if (!authUser.isActive) {
      throw new LoginFailedException();
    }

    const accessTokenId = this.uuid.generate();
    const sessionId = this.uuid.generate();

    const accessToken = this.signTokenService.sign(
      {
        sub: authUser.id,
        roleId: authUser.roleId,
        sessionId: sessionId,
      },
      process.env.JWT_SECRET!,
      '15m',
      accessTokenId,
    );

    const refreshToken = this.signTokenService.sign(
      {
        sub: authUser.id,
        sessionId: sessionId,
        roleId: authUser.roleId,
      },
      process.env.JWT_REFRESH_SECRET!,
      '7d',
      this.uuid.generate(),
    );

    const hashedRefreshToken = this.refreshTokenHasher.hash(refreshToken);

    await this.cache.set(
      `refresh_token:${authUser.id}:${sessionId}`,
      hashedRefreshToken,
      7 * 24 * 60 * 60 * 1000,
    );

    return { accessToken, refreshToken, roleId: authUser.roleId };
  }
}
