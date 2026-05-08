import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BookAuthorTypeOrm } from '../../../book-management/infrastructure/entities/book-author.entity';

@Entity('authors')
export class AuthorTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @OneToMany(() => BookAuthorTypeOrm, (bookAuthor) => bookAuthor.author)
  bookAuthor!: BookAuthorTypeOrm[];
}
