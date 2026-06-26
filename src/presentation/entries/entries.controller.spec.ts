import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CacheInterceptor } from '../../infrastructure/middlewares/cache/cache.interceptor';
import { CacheService } from '../../infrastructure/middlewares/cache/cache.service';
import { AddFavoriteUseCase } from '../../application/use-cases/favorite/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../../application/use-cases/favorite/remove-favorite.use-case';
import { GetWordDetailUseCase } from '../../application/use-cases/word/get-word-detail.use-case';
import { SearchWordsUseCase } from '../../application/use-cases/word/search-words.use-case';
import { EntriesController } from './entries.controller';

describe('EntriesController', () => {
  let controller: EntriesController;
  const searchWordsUseCase = { execute: jest.fn() };
  const getWordDetailUseCase = { execute: jest.fn() };
  const addFavoriteUseCase = { execute: jest.fn() };
  const removeFavoriteUseCase = { execute: jest.fn() };
  const user = { sub: 'user-id', email: 'a@b.com', name: 'A' };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EntriesController],
      providers: [
        { provide: SearchWordsUseCase, useValue: searchWordsUseCase },
        { provide: GetWordDetailUseCase, useValue: getWordDetailUseCase },
        { provide: AddFavoriteUseCase, useValue: addFavoriteUseCase },
        { provide: RemoveFavoriteUseCase, useValue: removeFavoriteUseCase },
        CacheInterceptor,
        {
          provide: CacheService,
          useValue: { get: jest.fn(), set: jest.fn(), generateKey: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue(300000) },
        },
      ],
    }).compile();

    controller = moduleRef.get(EntriesController);
    jest.clearAllMocks();
  });

  it('calls search use case', async () => {
    const dto = { search: 'fire', page: 1, limit: 10 };
    searchWordsUseCase.execute.mockResolvedValue({ results: [] });

    await controller.search(dto);

    expect(searchWordsUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('calls detail use case', async () => {
    getWordDetailUseCase.execute.mockResolvedValue([{ word: 'fire' }]);

    await controller.detail('fire', user);

    expect(getWordDetailUseCase.execute).toHaveBeenCalledWith('user-id', 'fire');
  });

  it('calls favorite and unfavorite use cases', async () => {
    await controller.favorite('fire', user);
    await controller.unfavorite('fire', user);

    expect(addFavoriteUseCase.execute).toHaveBeenCalledWith('user-id', 'fire');
    expect(removeFavoriteUseCase.execute).toHaveBeenCalledWith('user-id', 'fire');
  });
});
