import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.PGPORT || process.env.DB_PORT) || 5432,
  username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
  database: process.env.PGDATABASE || process.env.DB_NAME || 'english_dictionary',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await AppDataSource.initialize();
  console.log('Connected to DB');
  try {
    const res = await AppDataSource.query(`INSERT INTO "users" ("name", "email", "password_hash") VALUES ('Test', 'test@example.com', 'hash') RETURNING *`);
    console.log(res);
  } catch (err) {
    console.error('Insert failed:', err);
  }
  await AppDataSource.destroy();
}

run();
