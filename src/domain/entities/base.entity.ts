import { PrimaryColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'uuid_v7_generate()' })
  id!: string;
}
