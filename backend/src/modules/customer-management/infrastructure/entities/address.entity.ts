import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('addresses')
export class AddressTypeOrm {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

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
