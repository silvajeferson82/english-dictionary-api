import { Column, CreateDateColumn, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('words')
export class Word extends BaseEntity {
  @Index('idx_words_word')
  @Column({ type: 'varchar', length: 255, unique: true })
  word!: string;

  @Column({ type: 'jsonb' })
  data!: unknown;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
