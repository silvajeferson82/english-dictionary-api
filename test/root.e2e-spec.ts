import { INestApplication } from '@nestjs/common';
import { createE2EApp } from './factories/test-app.factory';
import { createRequester } from './factories/request.factory';

describe('Root Path E2E (/)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await createE2EApp());
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should return english dictionary message', async () => {
    const response = await createRequester(app).get('/').expect(200);
    const body = response.body as { message: string };

    expect(body).toEqual({ message: 'English Dictionary' });
  });
});
