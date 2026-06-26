import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createE2EApp, resetE2EDatabase } from './factories/test-app.factory';
import { createRequester } from './factories/request.factory';

type AuthResponse = {
  id: string;
  name: string;
  token: string;
};

describe('Auth Path E2E (/auth)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    ({ app, dataSource } = await createE2EApp());
    await resetE2EDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup should create user and return plain token', async () => {
    const response = await createRequester(app)
      .post('/auth/signup')
      .send({
        name: 'Auth User',
        email: `auth-${Date.now()}@example.com`,
        password: 'test1234',
      })
      .expect(201);
    const body = response.body as AuthResponse;

    expect(typeof body.id).toBe('string');
    expect(body.name).toBe('Auth User');
    expect(typeof body.token).toBe('string');
    expect(body.token.startsWith('Bearer ')).toBe(false);
  });

  it('POST /auth/signin should authenticate existing user', async () => {
    const email = `signin-${Date.now()}@example.com`;
    await createRequester(app).post('/auth/signup').send({
      name: 'SignIn User',
      email,
      password: 'test1234',
    });

    const response = await createRequester(app)
      .post('/auth/signin')
      .send({
        email,
        password: 'test1234',
      })
      .expect(201);
    const body = response.body as AuthResponse;

    expect(typeof body.id).toBe('string');
    expect(body.name).toBe('SignIn User');
    expect(typeof body.token).toBe('string');
    expect(body.token.startsWith('Bearer ')).toBe(false);
  });
});
