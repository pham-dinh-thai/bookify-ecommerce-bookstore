import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class PasswordNotMatchingException extends BadRequestDomainException {
  public constructor() {
    super('Password is not matching, try again', 'PASSWORD_NOT_MATCH');
  }
}
