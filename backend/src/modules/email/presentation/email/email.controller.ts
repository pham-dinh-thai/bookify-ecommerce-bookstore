import { Body, Controller, Param, Patch } from '@nestjs/common';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email.use-case';
import { VerifyEmailRequest } from './requests/verify-email.request';

@Controller('email')
export class EmailController {
  public constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase) {}

  @Patch('/:email/verify')
  public async verify(
    @Body() request: VerifyEmailRequest,
    @Param('email') email: string,
  ): Promise<void> {
    await this.verifyEmailUseCase.execute(request, email);
  }
}
