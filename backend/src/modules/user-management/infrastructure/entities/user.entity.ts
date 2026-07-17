import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleTypeOrm } from '../../../authorization/infrastructure/entities/role.entity';

@Entity('users')
export class UserTypeOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'] })
  gender!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  provider!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerId!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 50 })
  roleId!: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt!: Date | null;

  @ManyToOne(() => RoleTypeOrm)
  @JoinColumn({ name: 'roleId' })
  role!: RoleTypeOrm;

  @CreateDateColumn()
  createdAt!: Date;
}
