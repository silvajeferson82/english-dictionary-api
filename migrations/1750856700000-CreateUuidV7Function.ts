import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUuidV7Function1750856700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION uuid_v7_generate()
      RETURNS UUID
      LANGUAGE SQL
      AS $$
        SELECT gen_random_uuid();
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION IF EXISTS uuid_v7_generate();`);
  }
}
