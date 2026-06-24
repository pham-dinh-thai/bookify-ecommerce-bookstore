import { createHmac } from 'crypto';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IPaymentGatewayService } from '../../domain/payment-gateway.service';
import {
  CreateGatewayPaymentRequest,
  CreateGatewayPaymentResponse,
} from '../../domain/payment-gateway.types';

@Injectable()
export class VnpayPaymentGatewayService implements IPaymentGatewayService {
  private readonly logger = new Logger(VnpayPaymentGatewayService.name);

  private vnpayEncode(value: string): string {
    return encodeURIComponent(value).replace(/%20/g, '+');
  }

  public async createPayment(
    request: CreateGatewayPaymentRequest,
  ): Promise<CreateGatewayPaymentResponse> {
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const hashSecret = process.env.VNPAY_HASH_SECRET;
    const returnUrl = request.returnUrl;
    const endpoint =
      process.env.VNPAY_ENDPOINT ??
      'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    if (!tmnCode || !hashSecret || !returnUrl) {
      throw new InternalServerErrorException(
        'VNPay is not configured (VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_RETURN_URL)',
      );
    }

    const txnRef = `${request.orderId}-${Date.now()}`;
    const createDate = this.getCurrentDateString();

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: String(Math.round(request.amount) * 100),
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: this.truncate(request.orderInfo, 250),
      vnp_OrderType: 'other',
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: txnRef,
    };

    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys
      .map((key) => `${key}=${this.vnpayEncode(params[key])}`)
      .join('&');

    this.logger.debug(`VNPay signData: ${signData}`);

    const secureHash = createHmac('sha512', hashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    const queryString = sortedKeys
      .map((key) => `${this.vnpayEncode(key)}=${this.vnpayEncode(params[key])}`)
      .join('&');

    const payUrl = `${endpoint}?${queryString}&vnp_SecureHash=${secureHash}`;

    this.logger.debug(`VNPay payUrl: ${payUrl}`);

    return {
      providerOrderId: txnRef,
      payUrl,
      rawResponse: { ...params, vnp_SecureHash: secureHash },
    };
  }

  public buildHash(
    params: Record<string, string>,
    hashSecret: string,
  ): string {
    const filtered: Record<string, string> = {};
    for (const key of Object.keys(params)) {
      if (key.startsWith('vnp_') && key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
        filtered[key] = params[key];
      }
    }

    const sortedKeys = Object.keys(filtered).sort();
    const signData = sortedKeys
      .map((key) => `${key}=${this.vnpayEncode(filtered[key])}`)
      .join('&');

    return createHmac('sha512', hashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');
  }

  public verifyReturnParams(
    query: Record<string, string>,
    hashSecret: string,
  ): { isValid: boolean; responseCode: string } {
    const secureHash = query['vnp_SecureHash'];
    if (!secureHash) {
      return { isValid: false, responseCode: '99' };
    }

    const expectedHash = this.buildHash(query, hashSecret);

    this.logger.debug(`VNPay return - expected hash: ${expectedHash}, received: ${secureHash}`);

    return {
      isValid: expectedHash === secureHash,
      responseCode: query['vnp_ResponseCode'] ?? '99',
    };
  }

  private getCurrentDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  private truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength);
  }
}
