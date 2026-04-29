import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserTypeOrm } from '../../../user-management/infrastructure/entities/user.entity';

@Entity('customers')
export class CustomerTypeOrm {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @OneToOne(() => UserTypeOrm)
  @JoinColumn({ name: 'userId' })
  user!: UserTypeOrm;

  @Column({ name: 'userId', type: 'varchar', length: 36 })
  userId!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  phoneNumber!: string;
}
