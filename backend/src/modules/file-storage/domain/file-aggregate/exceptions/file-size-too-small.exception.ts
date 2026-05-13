import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class FileSizeTooSmallException extends BadRequestDomainException {
  public constructor() {
    super(`File size must be greater than 0 bytes`, 'FILE_SIZE_TOO_SMALL');
  }
}
