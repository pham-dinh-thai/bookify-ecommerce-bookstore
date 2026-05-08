import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageIdEmptyException extends DomainException {
  public constructor() {
    super('Language id is required', 'LANGUAGE_ID_EMPTY');
  }
}
