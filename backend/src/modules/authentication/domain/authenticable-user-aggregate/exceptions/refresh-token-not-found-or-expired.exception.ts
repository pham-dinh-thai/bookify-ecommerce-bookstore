import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class RefreshTokenNotFoundOrExpiredException extends NotFoundDomainException {
  public constructor() {
    super('Refresh token not found or expired', 'REFRESH_TOKEN_NOT_FOUND');
  }
}
