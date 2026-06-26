import 'dotenv/config';
import { DataSource } from 'typeorm';

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: toNumber(process.env.DB_PORT, 5436),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'english_dictionary',
  synchronize: false,
  migrations: ['migrations/*.{ts,js}'],
  entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
});

export default AppDataSource;
