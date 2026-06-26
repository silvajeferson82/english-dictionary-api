import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateWordsTable1750856700002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'words',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_v7_generate()',
          },
          {
            name: 'word',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'data',
            type: 'jsonb',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'words',
      new TableIndex({
        name: 'idx_words_word',
        columnNames: ['word'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('words', 'idx_words_word');
    await queryRunner.dropTable('words');
  }
}
