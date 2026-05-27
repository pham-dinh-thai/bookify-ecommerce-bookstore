import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class UserIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('User id is required', 'USER_ID_EMPTY');
  }
}
