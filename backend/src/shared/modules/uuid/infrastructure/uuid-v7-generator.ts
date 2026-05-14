import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { IUuidGenerator } from '../domain/uuid-generator.interface';

@Injectable()
export class UuidV7Generator implements IUuidGenerator {
  generate(): string {
    return uuid.v7();
  }
}
