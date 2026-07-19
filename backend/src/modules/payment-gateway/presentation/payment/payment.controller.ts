import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { CompleteMockPaymentUseCase } from '../../application/use-cases/complete-mock-payment/complete-mock-payment.use-case';
import { CompleteVnpayPaymentUseCase } from '../../application/use-cases/complete-vnpay-payment/complete-vnpay-payment.use-case';
import { CreateMockPaymentUseCase } from '../../application/use-cases/create-mock-payment/create-mock-payment.use-case';
import { CreatePaymentResponse } from '../../application/use-cases/create-payment/create-payment.response';
import { CreatePaymentUseCase } from '../../application/use-cases/create-payment/create-payment.use-case';
import { RetryPaymentUseCase } from '../../application/use-cases/retry-payment/retry-payment.use-case';
import { VnpayPaymentGatewayService } from '../../infrastructure/services/vnpay-payment-gateway.service';

@Controller('payment')
export class PaymentController {
  public constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly createMockPaymentUseCase: CreateMockPaymentUseCase,
    private readonly completeMockPaymentUseCase: CompleteMockPaymentUseCase,
    private readonly completeVnpayPaymentUseCase: CompleteVnpayPaymentUseCase,
    private readonly retryPaymentUseCase: RetryPaymentUseCase,
    private readonly vnpayPaymentGatewayService: VnpayPaymentGatewayService,
  ) {}

  @Post('orders/:orderId/vnpay')
  @UseGuards(JwtAuthGuard)
  public async createVnpayPayment(
    @Param('orderId') orderId: string,
    @CurrentUser('userId') userId: string,
    @Req() req: Request,
  ): Promise<CreatePaymentResponse> {
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    const origin = `${proto}://${req.get('host')}`;
    return this.createPaymentUseCase.execute(orderId, userId, origin);
  }

  @Post('orders/:orderId/vnpay/retry')
  @UseGuards(JwtAuthGuard)
  public async retryVnpayPayment(
    @Param('orderId') orderId: string,
    @CurrentUser('userId') userId: string,
    @Req() req: Request,
  ): Promise<CreatePaymentResponse> {
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    const origin = `${proto}://${req.get('host')}`;
    return this.retryPaymentUseCase.execute(orderId, userId, origin);
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

  @Get('vnpay/return')
  public async vnpayReturn(
    @Query() query: Record<string, string>,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const hashSecret = process.env.VNPAY_HASH_SECRET;
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    const frontendUrl = `${proto}://${req.get('host')}`;

    if (!hashSecret) {
      res.redirect(`${frontendUrl}/account/orders?payment=error`);
      return;
    }

    const { isValid, responseCode } =
      this.vnpayPaymentGatewayService.verifyReturnParams(query, hashSecret);

    if (!isValid) {
      res.redirect(`${frontendUrl}/account/orders?payment=fail`);
      return;
    }

    const providerOrderId = query['vnp_TxnRef'];

    if (responseCode === '00') {
      const providerTransactionId = query['vnp_TransactionNo'];

      if (providerOrderId && providerTransactionId) {
        try {
          await this.completeVnpayPaymentUseCase.succeed(
            providerOrderId,
            providerTransactionId,
          );
        } catch {
          res.redirect(`${frontendUrl}/account/orders?payment=error`);
          return;
        }
      }

      res.redirect(`${frontendUrl}/account/orders?payment=success`);
      return;
    }

    if (providerOrderId) {
      try {
        await this.completeVnpayPaymentUseCase.fail(providerOrderId);
      } catch {
        // Best-effort: still redirect to fail even if marking failed errors out
      }
    }

    res.redirect(`${frontendUrl}/account/orders?payment=fail`);
  }
}
