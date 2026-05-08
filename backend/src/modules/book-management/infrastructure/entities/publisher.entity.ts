import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('publishers')
export class PublisherTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;
}
