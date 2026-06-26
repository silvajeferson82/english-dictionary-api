import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetFavoritesUseCase } from '../../application/use-cases/favorite/get-favorites.use-case';
import { GetHistoryUseCase } from '../../application/use-cases/history/get-history.use-case';
import { GetProfileUseCase } from '../../application/use-cases/user/get-profile.use-case';
import { User } from '../../domain/entities/user.entity';
import { UserFavorite } from '../../domain/entities/user-favorite.entity';
import { UserHistory } from '../../domain/entities/user-history.entity';
import {
  USER_FAVORITE_REPOSITORY,
  USER_HISTORY_REPOSITORY,
  USER_REPOSITORY,
} from '../../domain/interfaces/repositories/tokens';
import { TypeUserFavoriteRepository } from '../../infrastructure/db/type-orm/repositories/type-user-favorite.repository';
import { TypeUserHistoryRepository } from '../../infrastructure/db/type-orm/repositories/type-user-history.repository';
import { TypeUserRepository } from '../../infrastructure/db/type-orm/repositories/type-user.repository';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserHistory, UserFavorite])],
  controllers: [UserController],
  providers: [
    GetProfileUseCase,
    GetHistoryUseCase,
    GetFavoritesUseCase,
    TypeUserRepository,
    TypeUserHistoryRepository,
    TypeUserFavoriteRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: TypeUserRepository,
    },
    {
      provide: USER_HISTORY_REPOSITORY,
      useExisting: TypeUserHistoryRepository,
    },
    {
      provide: USER_FAVORITE_REPOSITORY,
      useExisting: TypeUserFavoriteRepository,
    },
  ],
})
export class UserModule {}
