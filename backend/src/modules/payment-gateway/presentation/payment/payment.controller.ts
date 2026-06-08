import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { CompleteMockPaymentUseCase } from '../../application/use-cases/complete-mock-payment/complete-mock-payment.use-case';
import { CreateMockPaymentUseCase } from '../../application/use-cases/create-mock-payment/create-mock-payment.use-case';
import { CreatePaymentResponse } from '../../application/use-cases/create-payment/create-payment.response';
import { CreatePaymentUseCase } from '../../application/use-cases/create-payment/create-payment.use-case';

@Controller('payment')
export class PaymentController {
  public constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly createMockPaymentUseCase: CreateMockPaymentUseCase,
    private readonly completeMockPaymentUseCase: CompleteMockPaymentUseCase,
  ) {}

  @Post('orders/:orderId/momo')
  @UseGuards(JwtAuthGuard)
  public async createMomoPayment(
    @Param('orderId') orderId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<CreatePaymentResponse> {
    return this.createPaymentUseCase.execute(orderId, userId);
  }

  @Post('orders/:orderId/mock')
  @UseGuards(JwtAuthGuard)
  public async createMockPayment(
    @Param('orderId') orderId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<CreatePaymentResponse> {
    return this.createMockPaymentUseCase.execute(orderId, userId);
  }

  @Post('mock/:transactionId/succeed')
  @UseGuards(JwtAuthGuard)
  public async succeedMockPayment(
    @Param('transactionId') transactionId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.completeMockPaymentUseCase.succeed(transactionId, userId);
  }

  @Post('mock/:transactionId/fail')
  @UseGuards(JwtAuthGuard)
  public async failMockPayment(
    @Param('transactionId') transactionId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.completeMockPaymentUseCase.fail(transactionId, userId);
  }

  @Get('mock/:transactionId/scan/succeed')
  public async scanSucceedMockPayment(
    @Param('transactionId') transactionId: string,
  ): Promise<void> {
    await this.completeMockPaymentUseCase.scanSucceed(transactionId);
  }
}
