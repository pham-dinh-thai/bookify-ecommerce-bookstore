import { DomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageIdDuplicateException extends DomainException {
  public constructor() {
    super('Language id duplicated error', 'LANGUAGE_DUPLICATE');
  }
}
