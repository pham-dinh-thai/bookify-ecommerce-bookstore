export interface IStorageProvider {
  upload(buffer: Buffer, filename: string, mimetype: string): Promise<string>;
  delete(url: string): Promise<void>;
}

export const STORAGE_PROVIDER = 'IStorageProvider';
