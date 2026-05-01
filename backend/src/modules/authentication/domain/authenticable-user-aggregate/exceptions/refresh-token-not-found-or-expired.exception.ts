import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RefreshTokenNotFoundOrExpiredException extends DomainException {
  public constructor() {
    super('Refresh token not found or expired', 'REFRESH_TOKEN_NOT_FOUND', 404);
  }
}
