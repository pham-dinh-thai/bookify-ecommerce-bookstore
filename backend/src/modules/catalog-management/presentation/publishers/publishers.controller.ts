import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

@Controller('publishers')
export class PublishersController {
  public constructor(
    private readonly findPublishersUseCase: FindPublishersUseCase,
    private readonly findOnePublisherUseCase: FindOnePublisherUseCase,
    private readonly createPublisherUseCase: CreatePublisherUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<PublisherReadModel[]> {
    const publishers = await this.findPublishersUseCase.execute();

    return publishers;
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
}
