import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrm } from '../user-management/infrastructure/entities/user.entity';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { AUTHENTICABLE_USER_QUERY_REPOSITORY } from './domain/authenticable-user-aggregate/repositories/authenticable-user-query.repository.interface';
import { TypeOrmAuthenticableUserQueryRepository } from './infrastructure/repositories/typeorm-authenticable-user-query.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { UuidModule } from '../../shared/uuid/uuid.module';
import { AuthController } from './presentation/auth.controller';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { SIGN_TOKEN_SERVICE } from './domain/authenticable-user-aggregate/services/sign-token.service';
import { JwtSignTokenService } from './infrastructure/services/jwt-sign-token.service';
import { REFRESH_TOKEN_HASHER } from './domain/authenticable-user-aggregate/services/refresh-token-hasher.service';
import { CryptoRefreshTokenHasherService } from './infrastructure/services/crypto-refresh-token-hasher.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../shared/strategies/jwt.strategy';
import { AUTHENTICABLE_USER_COMMAND_REPOSITORY } from './domain/authenticable-user-aggregate/repositories/authenticable-user-command.repository.interface';
import { TypeOrmAuthenticableUserCommandRepository } from './infrastructure/repositories/typeorm-authenticable-user-command.repository';
import { RegisterUseCase } from './application/use-cases/register/register.use-case';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrm]),
    UnitOfWorkModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    UuidModule,
    SharedCacheModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '1d' },
    }),
    AuditLogModule,
  ],
  providers: [
    JwtStrategy,
    LoginUseCase,
    RegisterUseCase,
    {
      provide: AUTHENTICABLE_USER_QUERY_REPOSITORY,
      useClass: TypeOrmAuthenticableUserQueryRepository,
    },
    {
      provide: SIGN_TOKEN_SERVICE,
      useClass: JwtSignTokenService,
    },
    {
      provide: REFRESH_TOKEN_HASHER,
      useClass: CryptoRefreshTokenHasherService,
    },
    {
      provide: AUTHENTICABLE_USER_COMMAND_REPOSITORY,
      useClass: TypeOrmAuthenticableUserCommandRepository,
    },
  ],
  exports: [
    AUTHENTICABLE_USER_QUERY_REPOSITORY,
    JwtModule,
    AUTHENTICABLE_USER_COMMAND_REPOSITORY,
  ],
  controllers: [AuthController],
})
export class AuthenticationModule {}
