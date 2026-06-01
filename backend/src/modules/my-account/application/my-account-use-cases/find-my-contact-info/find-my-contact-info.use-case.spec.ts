import { ICustomersQueryRepository } from '../../../../customer-management/domain/customer-aggregate/repositories/customers-query.repository.interface';
import { FindMyContactInfoUseCase } from './find-my-contact-info.use-case';

describe('FindMyContactInfoUseCase', () => {
  it('returns empty contact info when the customer profile has not been created yet', async () => {
    const customersQueryRepository = {
      findByUserId: jest.fn().mockResolvedValue(null),
    };
    const useCase = new FindMyContactInfoUseCase(
      customersQueryRepository as unknown as ICustomersQueryRepository,
    );

    await expect(useCase.execute('user-id')).resolves.toEqual({
      phoneNumber: null,
      addresses: [],
    });
    expect(customersQueryRepository.findByUserId).toHaveBeenCalledWith(
      'user-id',
    );
  });
});
