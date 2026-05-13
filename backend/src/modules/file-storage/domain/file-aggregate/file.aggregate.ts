import { AggregateRoot } from '../../../../shared/domain/aggregate-root';

export class File extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private url: string,
    private filename: string,
    private mimetype: string,
    private size: number,
  ) {
    super();

    if (!id) {
      throw new Error('File ID cannot be empty');
    }

    if (!url) {
      throw new Error('File URL cannot be empty');
    }

    if (!filename) {
      throw new Error('File name cannot be empty');
    }

    if (!mimetype) {
      throw new Error('File MIME type cannot be empty');
    }

    if (size <= 0) {
      throw new Error('File size must be greater than zero');
    }
  }
}
