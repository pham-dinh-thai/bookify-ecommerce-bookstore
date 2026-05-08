import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('languages')
export class LanguageTypeOrm {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;
}
