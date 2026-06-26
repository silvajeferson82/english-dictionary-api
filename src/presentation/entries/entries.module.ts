import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddFavoriteUseCase } from '../../application/use-cases/favorite/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../../application/use-cases/favorite/remove-favorite.use-case';
import { GetWordDetailUseCase } from '../../application/use-cases/word/get-word-detail.use-case';
import { SearchWordsUseCase } from '../../application/use-cases/word/search-words.use-case';
import { UserFavorite } from '../../domain/entities/user-favorite.entity';
import { UserHistory } from '../../domain/entities/user-history.entity';
import { Word } from '../../domain/entities/word.entity';
import {
  USER_FAVORITE_REPOSITORY,
  USER_HISTORY_REPOSITORY,
  WORD_REPOSITORY,
} from '../../domain/interfaces/repositories/tokens';
import { TypeUserFavoriteRepository } from '../../infrastructure/db/type-orm/repositories/type-user-favorite.repository';
import { TypeUserHistoryRepository } from '../../infrastructure/db/type-orm/repositories/type-user-history.repository';
import { TypeWordRepository } from '../../infrastructure/db/type-orm/repositories/type-word.repository';
import { CacheInterceptor } from '../../infrastructure/middlewares/cache/cache.interceptor';
import { CacheService } from '../../infrastructure/middlewares/cache/cache.service';
import { EntriesController } from './entries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Word, UserHistory, UserFavorite])],
  controllers: [EntriesController],
  providers: [
    SearchWordsUseCase,
    GetWordDetailUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    CacheService,
    CacheInterceptor,
    TypeWordRepository,
    TypeUserHistoryRepository,
    TypeUserFavoriteRepository,
    {
      provide: WORD_REPOSITORY,
      useExisting: TypeWordRepository,
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
  exports: [
    WORD_REPOSITORY,
    USER_HISTORY_REPOSITORY,
    USER_FAVORITE_REPOSITORY,
    TypeWordRepository,
    TypeUserHistoryRepository,
    TypeUserFavoriteRepository,
  ],
})
export class EntriesModule {}
