import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignInUseCase } from '../../application/use-cases/auth/signin.use-case';
import { SignUpUseCase } from '../../application/use-cases/auth/signup.use-case';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/interfaces/repositories/tokens';
import { TypeUserRepository } from '../../infrastructure/db/type-orm/repositories/type-user.repository';
import { JwtStrategy } from '../../infrastructure/guards/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.getOrThrow<number>('auth.jwtExpiresIn'),
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignUpUseCase,
    SignInUseCase,
    TypeUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: TypeUserRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
