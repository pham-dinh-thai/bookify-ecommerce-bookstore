import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';
import { AddressTypeOrm } from './address.entity';

@Entity('customers')
export class CustomerTypeOrm {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @OneToOne(() => UserTypeOrm)
  @JoinColumn({ name: 'userId' })
  user!: UserTypeOrm;

  @Column({ name: 'userId', type: 'varchar', length: 36 })
  userId!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  phoneNumber?: string | null;

  @OneToMany(() => AddressTypeOrm, (address) => address.customer)
  addresses!: AddressTypeOrm[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
