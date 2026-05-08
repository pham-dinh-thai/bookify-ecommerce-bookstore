import { IsNotEmpty, IsString } from 'class-validator';
import { IRenamePublisherRequest } from '../../../application/publisher-use-cases/rename-publisher/rename-publisher.request';

export class RenamePublisherRequest implements IRenamePublisherRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
