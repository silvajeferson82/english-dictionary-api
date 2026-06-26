import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { HttpErrorFilter } from '../../src/infrastructure/middlewares/http-error-filter';
import { TypeormExceptionFilter } from '../../src/infrastructure/middlewares/typeorm-exception-filter';

const configureE2EEnvironment = (): void => {
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5437';
  process.env.DB_USERNAME = 'postgres';
  process.env.DB_PASSWORD = 'postgres';
  process.env.DB_NAME = 'english_dictionary_e2e';
};

export const createE2EApp = async (): Promise<{
  app: INestApplication;
  dataSource: DataSource;
}> => {
  configureE2EEnvironment();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new TypeormExceptionFilter(), new HttpErrorFilter());
  await app.init();

  const dataSource = app.get(DataSource);
  return { app, dataSource };
};

export const resetE2EDatabase = async (
  dataSource: DataSource,
): Promise<void> => {
  await dataSource.query(
    'TRUNCATE TABLE user_favorites, user_history, words, users RESTART IDENTITY CASCADE',
  );
};

export const seedWord = async (
  dataSource: DataSource,
  word: string,
): Promise<void> => {
  await dataSource.query(
    `INSERT INTO words (word, data) VALUES ($1, $2::jsonb) ON CONFLICT (word) DO NOTHING`,
    [word, JSON.stringify({ word, meanings: [] })],
  );
};
