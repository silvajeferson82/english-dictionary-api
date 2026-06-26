import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { authHeader, createAuthenticatedUser } from './factories/auth.factory';
import { createRequester } from './factories/request.factory';
import {
  createE2EApp,
  resetE2EDatabase,
  seedWord,
} from './factories/test-app.factory';

type ProfileResponse = {
  id: string;
  name: string;
  email: string;
};

type PaginatedWordEventResponse = {
  results: Array<{ word: string; added: string }>;
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

describe('User Path E2E (/user)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let token: string;
  let email: string;
  let name: string;

  beforeAll(async () => {
    ({ app, dataSource } = await createE2EApp());
    await resetE2EDatabase(dataSource);
    await seedWord(dataSource, 'fire');

    const auth = await createAuthenticatedUser(app, 'User Scope');
    token = auth.token;
    email = auth.email;
    name = auth.name;

    await createRequester(app)
      .get('/entries/en/fire')
      .set(authHeader(token))
      .expect(200);
    await createRequester(app)
      .post('/entries/en/fire/favorite')
      .set(authHeader(token))
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /user/me should require auth when token is missing', async () => {
    const response = await createRequester(app).get('/user/me').expect(401);
    const body = response.body as { message: string };

    expect(body).toEqual({ message: 'Unauthorized' });
  });

  it('GET /user/me should return authenticated profile', async () => {
    const response = await createRequester(app)
      .get('/user/me')
      .set(authHeader(token))
      .expect(200);
    const body = response.body as ProfileResponse;

    expect(typeof body.id).toBe('string');
    expect(body.name).toBe(name);
    expect(body.email).toBe(email);
  });

  it('GET /user/me/history should return visited words', async () => {
    const response = await createRequester(app)
      .get('/user/me/history?page=1&limit=10')
      .set(authHeader(token))
      .expect(200);
    const body = response.body as PaginatedWordEventResponse;

    expect(body.results).toEqual(
      expect.arrayContaining([expect.objectContaining({ word: 'fire' })]),
    );
  });

  it('GET /user/me/favorites should return favorited words', async () => {
    const response = await createRequester(app)
      .get('/user/me/favorites?page=1&limit=10')
      .set(authHeader(token))
      .expect(200);
    const body = response.body as PaginatedWordEventResponse;

    expect(body.results).toEqual(
      expect.arrayContaining([expect.objectContaining({ word: 'fire' })]),
    );
  });
});
