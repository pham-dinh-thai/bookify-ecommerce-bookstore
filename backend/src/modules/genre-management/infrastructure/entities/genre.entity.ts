import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('genres')
export class GenreTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
