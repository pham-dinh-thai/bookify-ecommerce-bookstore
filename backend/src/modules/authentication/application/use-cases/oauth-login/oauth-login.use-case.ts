import { Inject, Injectable } from '@nestjs/common';
import { IOAuthLoginRequest } from './oauth-login.request';
import {
  AUTHENTICABLE_USER_QUERY_REPOSITORY,
  type IAuthenticableUserQueryRepository,
} from '../../../domain/authenticable-user-aggregate/repositories/authenticable-user-query.repository.interface';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  type ISignTokenService,
  SIGN_TOKEN_SERVICE,
} from '../../../domain/authenticable-user-aggregate/services/sign-token.service';
import {
  type IRefreshTokenHasherService,
  REFRESH_TOKEN_HASHER,
} from '../../../domain/authenticable-user-aggregate/services/refresh-token-hasher.service';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { OauthLoginResponse } from './oauth-login.response';
import {
  AUTHENTICABLE_USER_COMMAND_REPOSITORY,
  type IAuthenticableUserCommandRepository,
} from '../../../domain/authenticable-user-aggregate/repositories/authenticable-user-command.repository.interface';
import { AuthenticableUser } from '../../../domain/authenticable-user-aggregate/authenticable-user.aggregate';
import { AuthenticableUserReadModel } from '../../../domain/authenticable-user-aggregate/read-models/authenticable-user.read-model';

@Injectable()
export class OAuthLoginUseCase {
  public constructor(
    @Inject(AUTHENTICABLE_USER_QUERY_REPOSITORY)
    private readonly authenticableUserQueryRepository: IAuthenticableUserQueryRepository,

    @Inject(AUTHENTICABLE_USER_COMMAND_REPOSITORY)
    private readonly authenticableUserCommandRepository: IAuthenticableUserCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuid: IUuidGenerator,

    @Inject(SIGN_TOKEN_SERVICE)
    private readonly signTokenService: ISignTokenService,

    @Inject(REFRESH_TOKEN_HASHER)
    private readonly refreshTokenHasher: IRefreshTokenHasherService,

    @Inject(CACHE_REPOSITORY)
    private readonly cache: ICacheRepository,
  ) {}

  public async execute(
    request: IOAuthLoginRequest,
  ): Promise<OauthLoginResponse | null> {
    let isNewUser = false;

    let authUser = await this.authenticableUserQueryRepository.findByProvider(
      request.provider,
      request.providerId,
    );

    if (!authUser) {
      isNewUser = true;

      const newUser = AuthenticableUser.registerWithOAuth(
        this.uuid.generate(),
        request.firstName,
        request.lastName,
        request.email,
        request.provider,
        request.providerId,
      );

      await this.authenticableUserCommandRepository.register(newUser);

      authUser = new AuthenticableUserReadModel(
        newUser.getId(),
        newUser.getEmail(),
        newUser.getPassword(),
        newUser.getRoleId(),
        newUser.getIsActive(),
        newUser.getProvider(),
        newUser.getProviderId(),
      );
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

    return new OauthLoginResponse(
      accessToken,
      refreshToken,
      authUser.roleId,
      isNewUser,
    );
  }
}
