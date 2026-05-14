import { FileSizeEmptyException } from '../exceptions/file-size-empty.exception';
import { FileSizeTooBigException } from '../exceptions/file-size-too-big.exception';
import { FileSizeTooSmallException } from '../exceptions/file-size-too-small.exception';

export class FileSize {
  private static readonly MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  private constructor(public readonly value: number) {}

  public static create(size: number): FileSize {
    if (!size) {
      throw new FileSizeEmptyException();
    }

    if (size <= 0) {
      throw new FileSizeTooSmallException();
    }

    if (size > FileSize.MAX_SIZE) {
      throw new FileSizeTooBigException(FileSize.MAX_SIZE);
    }

    return new FileSize(size);
  }

  public getValue(): number {
    return this.value;
  }
}
