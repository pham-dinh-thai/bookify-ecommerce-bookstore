import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IUuidGenerator } from '../domain/uuid-generator.interface';

@Injectable()
export class UuidV4Generator implements IUuidGenerator {
  generate(): string {
    return uuidv4();
  }
}
