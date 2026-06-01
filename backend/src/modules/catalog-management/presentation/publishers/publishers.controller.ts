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
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { CreatePublisherUseCase } from '../../application/publisher-use-cases/create-publisher/create-publisher.use-case';
import { CreatePublisherRequest } from './requests/create-publisher.request';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { RenamePublisherUseCase } from '../../application/publisher-use-cases/rename-publisher/rename-publisher.use-case';
import { RenamePublisherRequest } from './requests/rename-publisher.request';
import { DeletePublisherUseCase } from '../../application/publisher-use-cases/delete-publisher/delete-publisher.use-case';
import { FindPublishersResponse } from '../../application/publisher-use-cases/find-publishers/find-publishers.response';

@Controller('publishers')
export class PublishersController {
  public constructor(
    private readonly findPublishersUseCase: FindPublishersUseCase,
    private readonly findOnePublisherUseCase: FindOnePublisherUseCase,
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
    await this.createPublisherUseCase.execute(request, actorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async rename(
    @Param('id') id: string,
    @Body() request: RenamePublisherRequest,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.renamePublisherUseCase.execute(id, request, actorId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  public async remove(
    @Param('id') id: string,
    @CurrentUser('userId') actorId: string,
  ): Promise<void> {
    await this.deletePublisherUseCase.execute(id, actorId);
  }
}
