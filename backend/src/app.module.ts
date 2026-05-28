import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/cache-manager';
import { SharedCacheModule } from './shared/modules/cache/cache.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { CustomerManagementModule } from './modules/customer-management/customer-management.module';
import { BookManagementModule } from './modules/book-management/book-management.module';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { CatalogManagementModule } from './modules/catalog-management/catalog-management.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { CartManagementModule } from './modules/cart-management/cart-management.module';
import { MyAccountModule } from './modules/my-account/my-account.module';
import { OrderModule } from './modules/order/order.module';
import { OrderManagementModule } from './modules/order-management/order-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL_HOST'),
        port: config.get<number>('MYSQL_PORT'),
        username: config.get('MYSQL_USER'),
        password: config.get('MYSQL_PASSWORD'),
        database: config.get('MYSQL_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          new Keyv({
            store: new KeyvRedis(
              `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
            ),
            ttl: config.get<number>('REDIS_TTL') ?? 60 * 1000,
          }),
        ],
      }),
    }),

    CqrsModule.forRoot(),
    AuthorizationModule,
    AuthenticationModule,
    SharedCacheModule,
    AuditLogModule,
    UserManagementModule,
    CustomerManagementModule,
    BookManagementModule,
    CatalogManagementModule,
    FileStorageModule,
    CartManagementModule,
    MyAccountModule,
    OrderModule,
    OrderManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
