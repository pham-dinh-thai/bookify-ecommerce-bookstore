import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindUsersUseCase } from '../../application/user-use-cases/find-users/find-users.use-case';
import { FindOneUserUseCase } from '../../application/user-use-cases/find-one-users/find-one-user.use-case';
import { FindUsersResponse } from '../../application/user-use-cases/find-users/find-users.response';
import { FindOneUserResponse } from '../../application/user-use-cases/find-one-users/find-one-user.response';
import { CreateUserRequest } from './requests/create-user.request';
import { CreateUserUseCase } from '../../application/user-use-cases/create-user/create-user.use-case';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { UpdateUserRequest } from './requests/update-user.request';
import { UpdateUserUseCase } from '../../application/user-use-cases/update-user/update-user.use-case';
import { DeactivateUserUseCase } from '../../application/user-use-cases/deactivate-user/deactivate-user.use-case';
import { ActivateUserUseCase } from '../../application/user-use-cases/activate-user/activate-user.use-case';
import { FindTotalByRoleUseCase } from '../../application/user-use-cases/find-total-by-role/find-total-by-role.use-case';
import { UserFilter } from '../../domain/user-aggregate/user-filter';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class UsersController {
  public constructor(
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly findTotalByRoleUseCase: FindTotalByRoleUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('roleId') roleId?: string,
    @Query('excludeRoleId') excludeRoleId?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ): Promise<FindUsersResponse> {
    const filter = new UserFilter(
      roleId,
      excludeRoleId,
      isActive !== undefined ? isActive === 'true' : undefined,
    );

    const users = await this.findUsersUseCase.execute(
      parseInt(page),
      parseInt(limit),
      filter,
      search,
    );

    return users;
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<FindOneUserResponse | null> {
    const user = await this.findOneUserUseCase.execute(id);

    return user;
  }

  @Get('total/:roleId')
  public async totalByRole(@Param('roleId') roleId: string): Promise<number> {
    const total = await this.findTotalByRoleUseCase.execute(roleId);

    return total;
  }

  @Post()
  public async create(
    @Body() request: CreateUserRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.createUserUseCase.execute(request, actorId);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
    @CurrentUser('userId') actorId: string,
  ) {
    await this.updateUserUseCase.execute(id, request, actorId);
  }

  @Patch(':id/deactivate')
  public async deactivate(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.deactivateUserUseCase.execute(id, actorId);
  }

  @Patch(':id/activate')
  public async activate(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.activateUserUseCase.execute(id, actorId);
  }
}
