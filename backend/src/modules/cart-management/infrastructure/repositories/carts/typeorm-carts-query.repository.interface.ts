import { Injectable } from '@nestjs/common';
import { ICartsQueryRepository } from '../../../domain/cart-aggregate/repositories/carts-query.repository.interface';
import { CartReadModel } from '../../../domain/cart-aggregate/read-models/cart.read-model';
import { InjectRepository } from '@nestjs/typeorm';
import { CartTypeOrm } from '../../entities/cart.entity';
import { Repository } from 'typeorm';
import { CartsMapper } from '../../mappers/carts.mapper';

@Injectable()
export class TypeOrmCartsQueryRepository implements ICartsQueryRepository {
  public constructor(
    @InjectRepository(CartTypeOrm)
    private readonly repository: Repository<CartTypeOrm>,
  ) {}

  public async findUserCart(userId: string): Promise<CartReadModel | null> {
    const cartTypeOrm = await this.repository.findOne({
      relations: {
        cartItems: {
          product: {
            covers: true,
            bookAuthors: {
              author: true,
            },
          },
        },
      },
      where: { userId },
    });

    if (!cartTypeOrm) {
      return null;
    }

    return CartsMapper.toReadModel(cartTypeOrm);
  }
}
