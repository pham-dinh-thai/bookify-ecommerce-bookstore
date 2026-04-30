import { Module } from '@nestjs/common';
import { JWt_SERVICE } from './domain/jwt.service';
import { SharedJwtService } from './infrastructure/shared-jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [
    {
      provide: JWt_SERVICE,
      useClass: SharedJwtService,
    },
  ],
  exports: [JWt_SERVICE],
})
export class SharedJwtModule {}
