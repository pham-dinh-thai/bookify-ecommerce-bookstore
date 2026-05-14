import { Module } from '@nestjs/common';
import { UNIT_OF_WORK } from './application/unit-of-work';
import { TypeOrmUnitOfWork } from './infrastructure/typeorm-unit-of-work';

@Module({
  providers: [
    TypeOrmUnitOfWork,
    {
      provide: UNIT_OF_WORK,
      useExisting: TypeOrmUnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK, TypeOrmUnitOfWork],
})
export class UnitOfWorkModule {}
