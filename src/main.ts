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
let isInitialized = false;

async function bootstrap() {
  if (isInitialized) {
    return;
  }

  console.log('1 - criando app');

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  console.log('2 - app criado');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  console.log('3 - pipes');

  app.useGlobalFilters(
    new TypeormExceptionFilter(),
    new HttpErrorFilter(),
  );

  console.log('4 - filtros');

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('English Dictionary API')
    .setDescription(
      'API for dictionary entries, favorites, history and auth',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  console.log('5 - swagger config');

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  console.log('6 - swagger criado');

  SwaggerModule.setup('api', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  const configService = app.get(ConfigService);

  // opcional
  app.setGlobalPrefix(
    configService.get<string>('app.prefix') || '',
  );

  console.log('7 - iniciando');

  // Se estiver na Vercel, apenas inicializa. Localmente, sobe o listener.
  if (process.env.VERCEL) {
    await app.init();
  } else {
    const port = configService.get<number>('app.port') ?? 3000;
    await app.listen(port);
    console.log(`Application is running locally on: http://localhost:${port}`);
  }

  isInitialized = true;
  console.log('8 - iniciado');
}

if (!process.env.VERCEL) {
  bootstrap();
}

export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};

