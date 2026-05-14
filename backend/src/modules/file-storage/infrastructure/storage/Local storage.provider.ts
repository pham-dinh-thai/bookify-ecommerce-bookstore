import * as fs from 'fs/promises';
import * as path from 'path';
import { IStorageProvider } from '../../application/file-use-cases/ports/storage-provider.interface';

export class LocalStorageProvider implements IStorageProvider {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  public async upload(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.writeFile(path.join(this.uploadDir, filename), buffer);
    return `/uploads/${filename}`;
  }

  public async delete(url: string): Promise<void> {
    const filename = path.basename(url);
    await fs.unlink(path.join(this.uploadDir, filename));
  }
}
