import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindPublishersUseCase } from '../../application/publisher-use-cases/find-publishers/find-publishers.use-case';
import { FindOnePublisherUseCase } from '../../application/publisher-use-cases/find-one-publisher/find-one-publisher.use-case';
import { PublisherReadModel } from '../../domain/publisher-aggregate/read-models/publisher.read-model';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/guards/role.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CreatePublisherUseCase } from '../../application/publisher-use-cases/create-publisher/create-publisher.use-case';
import { CreatePublisherRequest } from './requests/create-publisher.request';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';
import { RenamePublisherUseCase } from '../../application/publisher-use-cases/rename-publisher/rename-publisher.use-case';
import { RenamePublisherRequest } from './requests/rename-publisher.request';
import { DeletePublisherUseCase } from '../../application/publisher-use-cases/delete-publisher/delete-publisher.use-case';
import { FindTotalPublisherUseCase } from '../../application/publisher-use-cases/find-total-publisher/find-total-publisher.use-case';
import { FindPublishersResponse } from '../../application/publisher-use-cases/find-publishers/find-publishers.response';

@Controller('publishers')
export class PublishersController {
  public constructor(
    private readonly findPublishersUseCase: FindPublishersUseCase,
    private readonly findOnePublisherUseCase: FindOnePublisherUseCase,
    private readonly findTotalPublisherUseCase: FindTotalPublisherUseCase,
    private readonly createPublisherUseCase: CreatePublisherUseCase,
    private readonly renamePublisherUseCase: RenamePublisherUseCase,
    private readonly deletePublisherUseCase: DeletePublisherUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ): Promise<FindPublishersResponse> {
    const response = await this.findPublishersUseCase.execute(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );

    return response;
  }

  @Get('total')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async total(): Promise<number> {
    const total = await this.findTotalPublisherUseCase.execute();

    return total;
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<PublisherReadModel | null> {
    const publisher = await this.findOnePublisherUseCase.execute(id);

    return publisher;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async create(
    @Body() request: CreatePublisherRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.createPublisherUseCase.execute(request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async rename(
    @Param('id') id: string,
    @Body() request: RenamePublisherRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.renamePublisherUseCase.execute(id, request, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async remove(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    try {
      await this.deletePublisherUseCase.execute(id, actorId);
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
