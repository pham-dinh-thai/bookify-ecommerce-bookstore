import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageNameEmptyException extends DomainException {
  public constructor() {
    super('Language name is required', 'LANGUAGE_NAME_EMPTY');
  }
}
