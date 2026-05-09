import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Language id is required', 'LANGUAGE_ID_EMPTY');
  }
}
