import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FindMyBasicInfoUseCase } from '../../application/my-account-use-cases/find-my-basic-info/find-my-basic-info.use-case';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { FindMyBasicInfoResponse } from '../../application/my-account-use-cases/find-my-basic-info/find-my-basic-info.response';
import { FindMyContactInfoResponse } from '../../application/my-account-use-cases/find-my-contact-info/find-my-contact-info.response';
import { FindMyContactInfoUseCase } from '../../application/my-account-use-cases/find-my-contact-info/find-my-contact-info.use-case';
import { ChangeEmailUseCase } from '../../application/my-account-use-cases/change-email/change-email.use-case';
import { ChangeEmailRequest } from './requests/change-email.request';
import { UpdateBasicInfoUseCase } from '../../application/my-account-use-cases/update-basic-info/update-basic-info.use-case';
import { UpdateBasicInfoRequest } from './requests/update-basic-info.request';
import { UpdatePhoneNumberUseCase } from '../../application/my-account-use-cases/update-phone-number/update-phone-number.use-case';
import { UpdatePhoneNumberRequest } from './requests/update-phone-number.request';
import { ChangePasswordRequest } from './requests/change-password.request';
import { ChangePasswordUseCase } from '../../application/my-account-use-cases/change-password/change-password.use-case';
import { AddAddressRequest } from './requests/add-address.request';
import { AddAddressUseCase } from '../../application/my-account-use-cases/add-address/add-address.use-case';
import { RemoveAddressUseCase } from '../../application/my-account-use-cases/remove-address/remove-address.use-case';
import { SetDefaultAddressUseCase } from '../../application/my-account-use-cases/set-default-address/set-default-address.use-case';

@Controller('my-account')
@UseGuards(JwtAuthGuard)
export class MyAccountController {
  public constructor(
    private readonly findMyBasicInfoUseCase: FindMyBasicInfoUseCase,
    private readonly findMyContactInfoUseCase: FindMyContactInfoUseCase,
    private readonly changeEmailUseCase: ChangeEmailUseCase,
    private readonly updateBasicInfoUseCase: UpdateBasicInfoUseCase,
    private readonly updatePhoneNumberUseCase: UpdatePhoneNumberUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly addAddressUseCase: AddAddressUseCase,
    private readonly removeAddressUseCase: RemoveAddressUseCase,
    private readonly setDefaultAddressUseCase: SetDefaultAddressUseCase,
  ) {}

  @Get('/basic-info')
  public async findMyBasicInfo(
    @CurrentUser('userId') userId: string,
  ): Promise<FindMyBasicInfoResponse> {
    const response = await this.findMyBasicInfoUseCase.execute(userId);

    return response;
  }

  @Get('/contact-info')
  public async findMyContactInfo(
    @CurrentUser('userId') userId: string,
  ): Promise<FindMyContactInfoResponse> {
    const response = await this.findMyContactInfoUseCase.execute(userId);

    return response;
  }

  @Patch('/email')
  public async changeEmail(
    @CurrentUser('userId') userId: string,
    @Body() request: ChangeEmailRequest,
  ): Promise<void> {
    await this.changeEmailUseCase.execute(request, userId);
  }

  @Put('/basic-info')
  public async updateBasicInfo(
    @Body() request: UpdateBasicInfoRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.updateBasicInfoUseCase.execute(request, userId);
  }

  @Patch('/phone-number')
  public async updatePhoneNumber(
    @Body() request: UpdatePhoneNumberRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.updatePhoneNumberUseCase.execute(request, userId);
  }

  @Patch('/password')
  public async changePassword(
    @Body() request: ChangePasswordRequest,
    @CurrentUser('userId') userId: string,
  ) {
    await this.changePasswordUseCase.execute(request, userId);
  }

  @Post('/address')
  public async addAddress(
    @Body() request: AddAddressRequest,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.addAddressUseCase.execute(request, userId);
  }

  @Delete('/address/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeAddress(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.removeAddressUseCase.execute(userId, id);
  }

  @Patch('/address/:id/is-default')
  public async setDefaultAddress(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    await this.setDefaultAddressUseCase.execute(userId, id);
  }
}
