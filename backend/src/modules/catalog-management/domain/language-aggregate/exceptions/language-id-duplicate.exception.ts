import { ConflictDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class LanguageIdDuplicateException extends ConflictDomainException {
  public constructor() {
    super('Language id duplicated error', 'LANGUAGE_DUPLICATE');
  }
}
