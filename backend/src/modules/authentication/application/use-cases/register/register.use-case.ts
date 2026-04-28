import { Injectable } from '@nestjs/common';
import { IRegisterRequest } from './register.request';

@Injectable()
export class RegisterUseCase {
  public async execute(request: IRegisterRequest): Promise<void> {}
}
