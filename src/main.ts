import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './infrastructure/middlewares/http-error-filter';
import { TypeormExceptionFilter } from './infrastructure/middlewares/typeorm-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new TypeormExceptionFilter(), new HttpErrorFilter());
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('English Dictionary API')
    .setDescription('API for dictionary entries, favorites, history and auth')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('app.port') ?? 3000);
}
bootstrap();
