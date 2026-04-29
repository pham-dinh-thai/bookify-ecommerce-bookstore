import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CustomerTypeOrm } from './customer.entity';

@Entity('addresses')
export class AddressTypeOrm {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @ManyToOne(() => CustomerTypeOrm)
  @JoinColumn({ name: 'customerId' })
  customer!: CustomerTypeOrm;

  @Column({ name: 'customerId', type: 'varchar', length: 36 })
  customerId!: string;

  @Column({ type: 'varchar', length: 255 })
  street!: string;

  @Column({ type: 'varchar', length: 50 })
  provinceCode!: string;

  @Column({ type: 'varchar', length: 100 })
  provinceName!: string;

  @Column({ type: 'varchar', length: 50 })
  wardCode!: string;

  @Column({ type: 'varchar', length: 100 })
  wardName!: string;

  @Column({ type: 'boolean' })
  isDefault!: boolean;
}
