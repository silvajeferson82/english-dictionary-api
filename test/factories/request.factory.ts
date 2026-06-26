import { INestApplication } from '@nestjs/common';
import request, { type SuperTest, type Test } from 'supertest';

type HttpServer = Parameters<typeof request>[0];

export const createRequester = (app: INestApplication): SuperTest<Test> =>
  request(app.getHttpServer() as HttpServer);
