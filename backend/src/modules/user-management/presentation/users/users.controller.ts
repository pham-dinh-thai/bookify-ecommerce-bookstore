import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FindUsersUseCase } from '../../application/user-use-cases/find-users/find-users.use-case';
import { FindOneUserUseCase } from '../../application/user-use-cases/find-one-users/find-one-user.use-case';
import { FindUsersResponse } from '../../application/user-use-cases/find-users/find-users.response';
import { FindOneUserResponse } from '../../application/user-use-cases/find-one-users/find-one-user.response';
import { CreateUserRequest } from './requests/create-user.request';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { CreateUserUseCase } from '../../application/user-use-cases/create-user/create-user.use-case';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { UpdateUserRequest } from './requests/update-user.request';
import { UpdateUserUseCase } from '../../application/user-use-cases/update-user/update-user.use-case';
import { DeactivateUserUseCase } from '../../application/user-use-cases/deactivate-user/deactivate-user.use-case';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class UsersController {
  public constructor(
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindUsersResponse[]> {
    const users = await this.findUsersUseCase.execute();

    return users;
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<FindOneUserResponse | null> {
    const user = await this.findOneUserUseCase.execute(id);

    return user;
  }

  @Post()
  public async create(
    @Body() request: CreateUserRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.createUserUseCase.execute(request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
    @CurrentUser('userId') actorId: string,
  ) {
    try {
      await this.updateUserUseCase.execute(id, request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Patch(':id/deactivate')
  public async deactivate(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.deactivateUserUseCase.execute(id, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
