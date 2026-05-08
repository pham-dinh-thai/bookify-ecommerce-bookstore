import { IsNotEmpty, IsString } from 'class-validator';
import { IRenameGenreRequest } from '../../../application/genre-use-cases/rename-genre/rename-genre.request';

export class RenameGenreRequest implements IRenameGenreRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;
}
