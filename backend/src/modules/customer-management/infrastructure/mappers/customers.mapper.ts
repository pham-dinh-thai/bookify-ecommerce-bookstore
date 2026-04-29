import { Customer } from '../../domain/customer-aggregate/customer.aggregate';
import { CustomerTypeOrm } from '../entities/customer.entity';

export class CustomersMapper {
  public static toTypeOrm(customer: Customer): CustomerTypeOrm {
    const customerTypeOrm = new CustomerTypeOrm();

    customerTypeOrm.id = customer.getId();
    customerTypeOrm.userId = customer.getUserId();
    customerTypeOrm.phoneNumber = customer.getPhoneNumber();

    return customerTypeOrm;
  }
}
