import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { FileMimeType } from './value-objects/file-mime-type';
import { FileSize } from './value-objects/file-size';

export class File extends AggregateRoot {
  private constructor(
    private readonly id: string,
    private url: string,
    private filename: string,
    private mimetype: FileMimeType,
    private size: FileSize,
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
  }

  public getMimeType(): string {
    return this.mimetype.getValue();
  }

  public getSize(): number {
    return this.size.getValue();
  }
}
