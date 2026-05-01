import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RefreshTokenInvalidException extends DomainException {
  public constructor() {
    super('Refresh token is invalid', 'REFRESH_TOKEN_INVALID');
  }
}
