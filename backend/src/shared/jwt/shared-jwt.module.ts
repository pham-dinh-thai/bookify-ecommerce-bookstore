import { Module } from '@nestjs/common';
import { JWt_SERVICE } from './domain/jwt.service';
import { SharedJwtService } from './infrastructure/shared-jwt.service';

@Module({
  providers: [
    {
      provide: JWt_SERVICE,
      useClass: SharedJwtService,
    },
  ],
  exports: [JWt_SERVICE],
})
export class SharedJwtModule {}
