import { Injectable } from '@nestjs/common';
import { IAddItemToCartRequest } from './add-item-to-cart.request';

@Injectable()
export class AddItemToCartUseCase {
  public constructor() {}

  public async execute(request: IAddItemToCartRequest) {}
}
