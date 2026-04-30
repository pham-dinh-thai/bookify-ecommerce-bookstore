import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class UserAlreadyDeactivatedException extends DomainException {
  public constructor() {
    super('User already deactivated', 'USER_ALREADY_DEACTIVATED');
  }
}
