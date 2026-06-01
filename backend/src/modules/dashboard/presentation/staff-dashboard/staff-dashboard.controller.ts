import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { GetStaffDashboardUseCase } from '../../application/dashboard-use-cases/get-staff-dashboard/get-staff-dashboard.use-case';
import { GetStaffDashboardResponse } from '../../application/dashboard-use-cases/get-staff-dashboard/get-staff-dashboard.response';

@Controller('staff-dashboard')
export class StaffDashboardController {
  public constructor(
    private readonly getStaffDashboardUseCase: GetStaffDashboardUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async getDashboard(): Promise<GetStaffDashboardResponse> {
    return this.getStaffDashboardUseCase.execute();
  }
}
