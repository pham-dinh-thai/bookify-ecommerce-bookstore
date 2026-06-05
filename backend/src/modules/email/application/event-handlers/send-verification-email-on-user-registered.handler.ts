import { Inject, Injectable } from '@nestjs/common';
import { IEventHandler } from '../../../../shared/domain/event-handler.interface';
import { UserRegistered } from '../../../authentication/domain/authenticable-user-aggregate/events/user-registered.event';
import {
  EMAIL_SENDER_SERVICE,
  type IEmailSenderService,
} from '../../domain/email-aggregate/services/email-sender.service';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../shared/modules/cache/domain/cache.repository.interface';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class SendVerificationEmailOnUserRegisteredHandler implements IEventHandler<UserRegistered> {
  public constructor(
    @Inject(EMAIL_SENDER_SERVICE)
    private readonly emailSenderService: IEmailSenderService,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async handle(event: UserRegistered): Promise<void> {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await this.cacheRepository.set(
      `email_verification_otp:${event.email}`,
      otp,
      5 * 60 * 1000,
    );

    await this.emailSenderService.send({
      to: event.email,
      subject: 'Verify your Bookify account',
      text: `Your Bookify verification code is ${otp}. This code expires in 5 minutes.`,
    });
  }
}
