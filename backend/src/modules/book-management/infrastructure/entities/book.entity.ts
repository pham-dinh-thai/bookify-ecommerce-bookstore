import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookGenreTypeOrm } from './book-genre.entity';
import { BookAuthorTypeOrm } from './book-author.entity';
import { PublisherTypeOrm } from '../../../catalog-management/infrastructure/entities/publisher.entity';
import { LanguageTypeOrm } from '../../../catalog-management/infrastructure/entities/language.entity';
import { BookCoverTypeOrm } from './book-cover.entity';

@Entity('books')
export class BookTypeOrm {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  isbn!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'uuid' })
  publisherId!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  languageId!: string;

  @Column({ type: 'int' })
  pageCount!: number;

  @Column({ type: 'boolean', default: true })
  isInStock!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => BookCoverTypeOrm, (cover) => cover.book)
  covers!: BookCoverTypeOrm[];

  @OneToOne(() => LanguageTypeOrm)
  @JoinColumn({ name: 'languageId' })
  language!: LanguageTypeOrm;

  @ManyToOne(() => PublisherTypeOrm)
  @JoinColumn({ name: 'publisherId' })
  publisher!: PublisherTypeOrm;

  @OneToMany(() => BookAuthorTypeOrm, (bookAuthor) => bookAuthor.book)
  bookAuthor!: BookAuthorTypeOrm[];

  @OneToMany(() => BookGenreTypeOrm, (bookGenre) => bookGenre.book)
  bookGenre!: BookGenreTypeOrm[];
}
