import { Test } from '@nestjs/testing';
import { GetFavoritesUseCase } from '../../application/use-cases/favorite/get-favorites.use-case';
import { GetHistoryUseCase } from '../../application/use-cases/history/get-history.use-case';
import { GetProfileUseCase } from '../../application/use-cases/user/get-profile.use-case';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  const getProfileUseCase = { execute: jest.fn() };
  const getHistoryUseCase = { execute: jest.fn() };
  const getFavoritesUseCase = { execute: jest.fn() };
  const user = { sub: 'user-id', email: 'a@b.com', name: 'A' };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: GetProfileUseCase, useValue: getProfileUseCase },
        { provide: GetHistoryUseCase, useValue: getHistoryUseCase },
        { provide: GetFavoritesUseCase, useValue: getFavoritesUseCase },
      ],
    }).compile();

    controller = moduleRef.get(UserController);
    jest.clearAllMocks();
  });

  it('calls profile use case', async () => {
    await controller.me(user);
    expect(getProfileUseCase.execute).toHaveBeenCalledWith('user-id');
  });

  it('calls history use case', async () => {
    await controller.history(user, { page: 2, limit: 5 });
    expect(getHistoryUseCase.execute).toHaveBeenCalledWith('user-id', 2, 5);
  });

  it('calls favorites use case', async () => {
    await controller.favorites(user, { page: 1, limit: 10 });
    expect(getFavoritesUseCase.execute).toHaveBeenCalledWith('user-id', 1, 10);
  });
});
