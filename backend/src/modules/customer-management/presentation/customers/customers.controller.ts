import { Controller, Param, Post } from '@nestjs/common';
import ExceptionHandler from '../../../../shared/domain/exception/exception.handler';

@Controller('customers')
export class CustomersController {
  @Post(':email/complete-profile')
  public async completeProfile(@Param('email') email: string) {
    try {
      return email;
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
