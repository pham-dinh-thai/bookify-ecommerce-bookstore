import { BadRequestDomainException } from '../../exception/domain.exception';

export class EmailEmptyException extends BadRequestDomainException {
  constructor() {
    super('Email is required!', 'EMAIL_EMPTY');
  }
}
