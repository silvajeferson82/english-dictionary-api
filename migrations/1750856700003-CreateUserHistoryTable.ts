import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserHistoryTable1750856700003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_v7_generate()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'word',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'added_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_history',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'user_history',
      new TableIndex({
        name: 'idx_user_history_user_id',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_history', 'idx_user_history_user_id');

    const table = await queryRunner.getTable('user_history');
    const foreignKey = table?.foreignKeys.find((item) =>
      item.columnNames.includes('user_id'),
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('user_history', foreignKey);
    }

    await queryRunner.dropTable('user_history');
  }
}
