import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageNameEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Language name is required', 'LANGUAGE_NAME_EMPTY');
  }
}
