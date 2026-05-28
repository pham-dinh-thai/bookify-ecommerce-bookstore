import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin', 'staff')
export class OrdersController {}
