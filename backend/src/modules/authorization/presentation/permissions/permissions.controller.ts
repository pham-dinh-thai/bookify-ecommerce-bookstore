import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FindPermissionsUseCase } from '../../application/permission-use-cases/find-permissions/find-permissions.use-case';
import { FindPermissionsResponse } from '../../application/permission-use-cases/find-permissions/find-permissions.response';
import { FindOnePermissionUseCase } from '../../application/permission-use-cases/find-one-permission/find-one-permission.use-case';
import { CreatePermissionRequest } from './requests/create-permission.request';
import { CreatePermissionUseCase } from '../../application/permission-use-cases/create-permission/create-permission.use-case';
import { DeletePermissionUseCase } from '../../application/permission-use-cases/delete-permission/delete-permission.use-case';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class PermissionsController {
  public constructor(
    private readonly findPermissionsUseCase: FindPermissionsUseCase,
    private readonly findOnePermissionUseCase: FindOnePermissionUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindPermissionsResponse[]> {
    const permissions = await this.findPermissionsUseCase.execute();

    return permissions;
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<FindPermissionsResponse | null> {
    const permission = await this.findOnePermissionUseCase.execute(id);

    return permission;
  }

  @Post()
  public async create(
    @Body() request: CreatePermissionRequest,
    @CurrentUser('userId') actorId: string,
  ) {
    try {
      await this.createPermissionUseCase.execute(request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.deletePermissionUseCase.execute(id, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
