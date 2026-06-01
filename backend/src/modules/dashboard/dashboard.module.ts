import { Module } from '@nestjs/common';
import { AdminDashboardController } from './presentation/admin-dashboard/admin-dashboard.controller';
import { StaffDashboardController } from './presentation/staff-dashboard/staff-dashboard.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { OrderModule } from '../order/order.module';
import { BookManagementModule } from '../book-management/book-management.module';
import { GetStaffDashboardUseCase } from './application/dashboard-use-cases/get-staff-dashboard/get-staff-dashboard.use-case';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  controllers: [AdminDashboardController, StaffDashboardController],
  imports: [
    AuthenticationModule,
    OrderModule,
    BookManagementModule,
    AuditLogModule,
  ],
  providers: [GetStaffDashboardUseCase],
})
export class DashboardModule {}
