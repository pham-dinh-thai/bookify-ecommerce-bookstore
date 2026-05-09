import { BadRequestDomainException } from '../../exception/domain.exception';

export class PasswordEmptyException extends BadRequestDomainException {
  constructor() {
    super('Password is required!', 'PASSWORD_EMPTY');
  }
}
