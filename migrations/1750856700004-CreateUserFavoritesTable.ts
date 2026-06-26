import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserFavoritesTable1750856700004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_favorites',
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
        uniques: [
          {
            name: 'uq_user_favorites_user_word',
            columnNames: ['user_id', 'word'],
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_favorites',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_favorites');
    const foreignKey = table?.foreignKeys.find((item) =>
      item.columnNames.includes('user_id'),
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('user_favorites', foreignKey);
    }

    await queryRunner.dropTable('user_favorites');
  }
}
