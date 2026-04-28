import { Injectable } from '@nestjs/common';
import { IRefreshTokenHasherService } from '../../domain/authenticable-user-aggregate/services/refresh-token-hasher.service';
import * as crypto from 'crypto';

@Injectable()
export class CryptoRefreshTokenHasherService implements IRefreshTokenHasherService {
  public hash(refreshToken: string): string {
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
  }
}
