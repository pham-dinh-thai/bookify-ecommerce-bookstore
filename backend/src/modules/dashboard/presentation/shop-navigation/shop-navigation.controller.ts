import { Controller, Get } from '@nestjs/common';
import { GetShopNavigationUseCase } from '../../application/dashboard-use-cases/get-shop-navigation/get-shop-navigation.use-case';
import { GetShopNavigationResponse } from '../../application/dashboard-use-cases/get-shop-navigation/get-shop-navigation.response';

@Controller('shop-navigation')
export class ShopNavigationController {
  public constructor(
    private readonly getShopNavigationUseCase: GetShopNavigationUseCase,
  ) {}

  @Get()
  public async getNavigation(): Promise<GetShopNavigationResponse> {
    return this.getShopNavigationUseCase.execute();
  }
}
