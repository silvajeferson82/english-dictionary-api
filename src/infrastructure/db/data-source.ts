import 'dotenv/config';
import { DataSource } from 'typeorm';

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.POSTGRES_URL || process.env.DATABASE_URL
    ? {
        url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
        port: toNumber(process.env.PGPORT || process.env.DB_PORT, 5432),
        username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
        database: process.env.PGDATABASE || process.env.DB_NAME || 'english_dictionary',
        ssl:
          process.env.PGSSLMODE === 'require' || process.env.DB_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
  synchronize: false,
  migrations: ['migrations/*.{ts,js}'],
  entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
});

export default AppDataSource;
