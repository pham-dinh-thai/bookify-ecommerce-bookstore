import { Module } from '@nestjs/common';
import { AdminDashboardController } from './presentation/admin-dashboard/admin-dashboard.controller';
import { StaffDashboardController } from './presentation/staff-dashboard/staff-dashboard.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { OrderModule } from '../order/order.module';
import { BookManagementModule } from '../book-management/book-management.module';
import { GetStaffDashboardUseCase } from './application/dashboard-use-cases/get-staff-dashboard/get-staff-dashboard.use-case';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { GetAdminDashboardUseCase } from './application/dashboard-use-cases/get-admin-dashboard/get-admin-dashboard.use-case';
import { UserManagementModule } from '../user-management/user-management.module';
import { CustomerManagementModule } from '../customer-management/customer-management.module';
import { GenresModule } from '../catalog-management/genres.module';
import { PublishersModule } from '../catalog-management/publishers.module';
import { AuthorsModule } from '../catalog-management/authors.module';
import { LanguagesModule } from '../catalog-management/languages.module';
import { ShopNavigationController } from './presentation/shop-navigation/shop-navigation.controller';
import { GetShopNavigationUseCase } from './application/dashboard-use-cases/get-shop-navigation/get-shop-navigation.use-case';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';

@Module({
  controllers: [
    AdminDashboardController,
    StaffDashboardController,
    ShopNavigationController,
  ],
  imports: [
    AuthenticationModule,
    OrderModule,
    BookManagementModule,
    AuditLogModule,
    UserManagementModule,
    CustomerManagementModule,
    GenresModule,
    PublishersModule,
    AuthorsModule,
    LanguagesModule,
    SharedCacheModule,
  ],
  providers: [
    GetStaffDashboardUseCase,
    GetAdminDashboardUseCase,
    GetShopNavigationUseCase,
  ],
})
export class DashboardModule {}
