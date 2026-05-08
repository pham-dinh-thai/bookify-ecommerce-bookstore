import { Controller, Get, Param } from '@nestjs/common';
import { FindPublishersUseCase } from '../../application/publisher-use-cases/find-publishers/find-publishers.use-case';
import { FindOnePublisherUseCase } from '../../application/publisher-use-cases/find-one-publisher/find-one-publisher.use-case';
import { PublisherReadModel } from '../../domain/publisher-aggregate/read-models/publisher.read-model';

@Controller('publishers')
export class PublishersController {
  public constructor(
    private readonly findPublishersUseCase: FindPublishersUseCase,
    private readonly findOnePublisherUseCase: FindOnePublisherUseCase,
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
}
