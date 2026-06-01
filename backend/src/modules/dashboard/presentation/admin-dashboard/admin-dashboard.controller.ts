import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { GetAdminDashboardUseCase } from '../../application/dashboard-use-cases/get-admin-dashboard/get-admin-dashboard.use-case';
import { GetAdminDashboardResponse } from '../../application/dashboard-use-cases/get-admin-dashboard/get-admin-dashboard.response';

@Controller('admin-dashboard')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class AdminDashboardController {
  public constructor(
    private readonly getAdminDashboardUseCase: GetAdminDashboardUseCase,
  ) {}

  @Get()
  public async getDashboard(): Promise<GetAdminDashboardResponse> {
    return this.getAdminDashboardUseCase.execute();
  }
}
