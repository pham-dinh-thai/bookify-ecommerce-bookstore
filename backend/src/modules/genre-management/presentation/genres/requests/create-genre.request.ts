import { IsNotEmpty, IsString } from 'class-validator';
import { ICreateGenreRequest } from '../../../application/genre-use-cases/create-genre/create-genre.request';

export class CreateGenreRequest implements ICreateGenreRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;
}
