import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { authHeader, createAuthenticatedUser } from './factories/auth.factory';
import { createRequester } from './factories/request.factory';
import {
  createE2EApp,
  resetE2EDatabase,
  seedWord,
} from './factories/test-app.factory';

type SearchEntriesResponse = {
  results: Array<{ word: string }>;
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

describe('Entries Path E2E (/entries/en)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let token: string;

  beforeAll(async () => {
    ({ app, dataSource } = await createE2EApp());
    await resetE2EDatabase(dataSource);
    await seedWord(dataSource, 'fire');
    const auth = await createAuthenticatedUser(app);
    token = auth.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /entries/en should return paginated words', async () => {
    const response = await createRequester(app)
      .get('/entries/en?search=fire&page=1&limit=10')
      .set(authHeader(token))
      .expect(200);
    const body = response.body as SearchEntriesResponse;

    expect(body.results.some((item) => item.word === 'fire')).toBe(true);
    expect(typeof body.totalDocs).toBe('number');
    expect(body.page).toBe(1);
    expect(typeof body.totalPages).toBe('number');
    expect(typeof body.hasNext).toBe('boolean');
    expect(typeof body.hasPrev).toBe('boolean');
  });

  it('GET /entries/en/:word should return detail and cache headers', async () => {
    const first = await createRequester(app)
      .get('/entries/en/fire')
      .set(authHeader(token))
      .expect(200);

    expect(first.headers['x-cache']).toBe('MISS');
    expect(first.headers['x-response-time']).toMatch(/ms$/);

    const second = await createRequester(app)
      .get('/entries/en/fire')
      .set(authHeader(token))
      .expect(200);

    expect(second.headers['x-cache']).toBe('HIT');
    expect(second.headers['x-response-time']).toMatch(/ms$/);
  });

  it('POST and DELETE favorite endpoints should succeed', async () => {
    await createRequester(app)
      .post('/entries/en/fire/favorite')
      .set(authHeader(token))
      .expect(200);

    await createRequester(app)
      .delete('/entries/en/fire/unfavorite')
      .set(authHeader(token))
      .expect(204);
  });
});
