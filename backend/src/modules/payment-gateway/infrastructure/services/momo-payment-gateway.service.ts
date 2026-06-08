import { createHmac } from 'crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IPaymentGatewayService } from '../../domain/payment-gateway.service';
import {
  CreateGatewayPaymentRequest,
  CreateGatewayPaymentResponse,
} from '../../domain/payment-gateway.types';

type MomoCreatePaymentResponse = {
  resultCode?: number;
  message?: string;
  orderId?: string;
  payUrl?: string;
};

@Injectable()
export class MomoPaymentGatewayService implements IPaymentGatewayService {
  public async createPayment(
    request: CreateGatewayPaymentRequest,
  ): Promise<CreateGatewayPaymentResponse> {
    const partnerCode = this.getRequiredEnv('MOMO_PARTNER_CODE');
    const accessKey = this.getRequiredEnv('MOMO_ACCESS_KEY');
    const secretKey = this.getRequiredEnv('MOMO_SECRET_KEY');
    const endpoint =
      process.env.MOMO_CREATE_PAYMENT_ENDPOINT ??
      'https://test-payment.momo.vn/v2/gateway/api/create';
    const redirectUrl = this.getRequiredEnv('MOMO_REDIRECT_URL');
    const ipnUrl = this.getRequiredEnv('MOMO_IPN_URL');
    const requestType = 'captureWallet';
    const extraData = '';
    const requestId = this.createRequestId();
    const providerOrderId = `${request.orderId}-${Date.now()}`;
    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${request.amount}`,
      `extraData=${extraData}`,
      `ipnUrl=${ipnUrl}`,
      `orderId=${providerOrderId}`,
      `orderInfo=${request.orderInfo}`,
      `partnerCode=${partnerCode}`,
      `redirectUrl=${redirectUrl}`,
      `requestId=${requestId}`,
      `requestType=${requestType}`,
    ].join('&');
    const signature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerCode,
        accessKey,
        requestId,
        amount: request.amount,
        orderId: providerOrderId,
        orderInfo: request.orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi',
      }),
    });
    const data = (await response.json()) as MomoCreatePaymentResponse;

    if (!response.ok) {
      throw new InternalServerErrorException(
        data.message ?? 'MoMo create payment request failed',
      );
    }

    if (data.resultCode !== 0 || !data.payUrl) {
      throw new BadRequestException(
        data.message ?? 'MoMo could not create payment URL',
      );
    }

    return {
      providerOrderId: data.orderId ?? providerOrderId,
      payUrl: data.payUrl,
      rawResponse: data,
    };
  }

  private getRequiredEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
      throw new InternalServerErrorException(`${key} is not configured`);
    }

    return value;
  }

  private createRequestId(): string {
    return `${Date.now()}${Math.random().toString(36).slice(2, 12)}`.slice(
      0,
      50,
    );
  }
}
