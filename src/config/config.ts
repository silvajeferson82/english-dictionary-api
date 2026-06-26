import { registerAs } from '@nestjs/config';

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

export const appConfig = registerAs('app', () => ({
  port: toNumber(process.env.PORT, 3000),
}));

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: toNumber(process.env.DB_PORT, 5436),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  name: process.env.DB_NAME ?? 'english_dictionary',
}));

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'super-secret-key',
  jwtExpiresIn: toNumber(process.env.JWT_EXPIRES_IN, 86400),
}));

export const cacheConfig = registerAs('cache', () => ({
  ttlMs: toNumber(process.env.CACHE_TTL_MS, 300000),
}));
