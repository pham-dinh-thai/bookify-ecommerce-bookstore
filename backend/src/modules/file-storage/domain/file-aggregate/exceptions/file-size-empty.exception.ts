import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class FileSizeEmptyException extends BadRequestDomainException {
  public constructor() {
    super(`File size cannot be empty`, 'FILE_SIZE_EMPTY');
  }
}
