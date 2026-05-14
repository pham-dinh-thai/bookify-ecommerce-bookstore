import { Module } from '@nestjs/common';
import { UUID_GENERATOR } from './domain/uuid-generator.interface';
import { UuidV7Generator } from './infrastructure/uuid-v7-generator';

@Module({
  providers: [
    {
      provide: UUID_GENERATOR,
      useClass: UuidV7Generator,
    },
  ],
  exports: [UUID_GENERATOR],
})
export class UuidModule {}
