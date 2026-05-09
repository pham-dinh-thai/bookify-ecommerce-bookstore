import { ConflictDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class UserAlreadyDeactivatedException extends ConflictDomainException {
  public constructor() {
    super('User already deactivated', 'USER_ALREADY_DEACTIVATED');
  }
}
