import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class UserNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('User not found', 'USER_NOT_FOUND');
  }
}
