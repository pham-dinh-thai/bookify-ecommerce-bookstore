import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class FileMimeTypeEmptyException extends BadRequestDomainException {
  public constructor() {
    super(`File MIME type cannot be empty`, 'FILE_MIME_TYPE_EMPTY');
  }
}
