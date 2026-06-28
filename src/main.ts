import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';
import { HttpErrorFilter } from './infrastructure/middlewares/http-error-filter';
import { TypeormExceptionFilter } from './infrastructure/middlewares/typeorm-exception-filter';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new TypeormExceptionFilter(),
    new HttpErrorFilter(),
  );

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('English Dictionary API')
    .setDescription(
      'API for dictionary entries, favorites, history and auth',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  // opcional
  app.setGlobalPrefix(
    configService.get<string>('app.prefix') || '',
  );

  // Se estiver na Vercel, apenas inicializa. Localmente, sobe o listener.
  if (process.env.VERCEL) {
    await app.init();
  } else {
    const port = configService.get<number>('app.port') ?? 3000;
    await app.listen(port);
    console.log(`Application is running locally on: http://localhost:${port}`);
  }
}

bootstrap();

export default server;
