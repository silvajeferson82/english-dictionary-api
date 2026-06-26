import { INestApplication } from '@nestjs/common';
import { createRequester } from './request.factory';

export type AuthUserFactoryOutput = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthResponse = {
  id: string;
  name: string;
  token: string;
};

export const createAuthenticatedUser = async (
  app: INestApplication,
  name = 'E2E User',
): Promise<AuthUserFactoryOutput> => {
  const http = createRequester(app);
  const email = `e2e-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
  const password = 'test1234';

  const signupResponse = await http
    .post('/auth/signup')
    .send({ name, email, password })
    .expect(201);

  const signinResponse = await http
    .post('/auth/signin')
    .send({ email, password })
    .expect(201);
  const signupBody = signupResponse.body as AuthResponse;
  const signinBody = signinResponse.body as AuthResponse;

  return {
    id: signupBody.id,
    name: signupBody.name,
    email,
    token: signinBody.token,
  };
};

export const authHeader = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
});
