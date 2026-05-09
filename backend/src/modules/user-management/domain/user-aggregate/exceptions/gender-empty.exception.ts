import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class GenderEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Gender is required,', 'GENDER_EMPTY');
  }
}
