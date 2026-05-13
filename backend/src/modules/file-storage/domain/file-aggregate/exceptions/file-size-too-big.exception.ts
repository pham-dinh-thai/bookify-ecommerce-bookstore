import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class FileSizeTooBigException extends BadRequestDomainException {
  public constructor(maxSizeInBytes: number) {
    super(
      `File size must be less than ${maxSizeInBytes} bytes`,
      'FILE_SIZE_TOO_BIG',
    );
  }
}
