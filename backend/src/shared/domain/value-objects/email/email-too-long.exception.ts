import { BadRequestDomainException } from '../../exception/domain.exception';

export class EmailTooLongException extends BadRequestDomainException {
  constructor() {
    super('Email too long! (max: 100 characters)', 'EMAIL_TOO_LONG');
  }
}
