import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './presentation/auth/auth.module';
import {
  authConfig,
  appConfig,
  cacheConfig,
  databaseConfig,
} from './config/config';
import { User } from './domain/entities/user.entity';
import { UserFavorite } from './domain/entities/user-favorite.entity';
import { UserHistory } from './domain/entities/user-history.entity';
import { Word } from './domain/entities/word.entity';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { EntriesModule } from './presentation/entries/entries.module';
import { UserModule } from './presentation/user/user.module';
import { AppRoutesModule } from './presentation/app/app-routes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, authConfig, cacheConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const url = configService.get<string>('database.url');
        return {
          type: 'postgres',
          ...(url
            ? { url }
            : {
                host: configService.getOrThrow<string>('database.host'),
                port: configService.getOrThrow<number>('database.port'),
                username: configService.getOrThrow<string>('database.username'),
                password: configService.getOrThrow<string>('database.password'),
                database: configService.getOrThrow<string>('database.name'),
              }),
          synchronize: false,
          autoLoadEntities: true,
          ssl: url ? { rejectUnauthorized: false } : (configService.get<boolean>('database.ssl') ? { rejectUnauthorized: false } : false),
          retryAttempts: process.env.VERCEL ? 1 : 10,
          retryDelay: 3000,
        };
      },
    }),
    AuthModule,
    EntriesModule,
    UserModule,
    AppRoutesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
