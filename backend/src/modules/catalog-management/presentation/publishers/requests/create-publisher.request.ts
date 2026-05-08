import { IsNotEmpty, IsString } from 'class-validator';
import { ICreatePublisherRequest } from '../../../application/publisher-use-cases/create-publisher/create-publisher.request';

export class CreatePublisherRequest implements ICreatePublisherRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;
}
