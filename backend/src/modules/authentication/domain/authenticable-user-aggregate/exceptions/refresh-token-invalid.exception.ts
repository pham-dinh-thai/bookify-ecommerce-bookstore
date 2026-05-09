import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RefreshTokenInvalidException extends BadRequestDomainException {
  public constructor() {
    super('Refresh token is invalid', 'REFRESH_TOKEN_INVALID');
  }
}
