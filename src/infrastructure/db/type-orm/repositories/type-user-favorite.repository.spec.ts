import { Repository } from 'typeorm';
import { UserFavorite } from '../../../../domain/entities/user-favorite.entity';
import { TypeUserFavoriteRepository } from './type-user-favorite.repository';

type MockRepo<T extends object> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('TypeUserFavoriteRepository', () => {
  const repository: MockRepo<UserFavorite> = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
    findAndCount: jest.fn(),
  };

  const sut = new TypeUserFavoriteRepository(
    repository as unknown as Repository<UserFavorite>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts a favorite record', async () => {
    const created = { userId: 'user-id', word: 'fire' } as UserFavorite;
    const saved = { id: 'favorite-id', ...created };

    repository.create!.mockReturnValue(created);
    repository.save!.mockResolvedValue(saved);

    const result = await sut.insert({ userId: 'user-id', word: 'fire' });

    expect(repository.create).toHaveBeenCalledWith({
      userId: 'user-id',
      word: 'fire',
    });
    expect(repository.save).toHaveBeenCalledWith(created);
    expect(result).toBe(saved);
  });

  it('deletes favorite by user and word', async () => {
    repository.delete!.mockResolvedValue({ affected: 1 });

    await sut.deleteByUserAndWord('user-id', 'fire');

    expect(repository.delete).toHaveBeenCalledWith({
      userId: 'user-id',
      word: 'fire',
    });
  });

  it('checks if favorite exists', async () => {
    repository.exists!.mockResolvedValue(true);

    const result = await sut.exists('user-id', 'fire');

    expect(result).toBe(true);
    expect(repository.exists).toHaveBeenCalledWith({
      where: { userId: 'user-id', word: 'fire' },
    });
  });

  it('returns paginated favorites by user id', async () => {
    const favorites = [{ id: 'favorite-id', word: 'fire' }] as UserFavorite[];
    repository.findAndCount!.mockResolvedValue([favorites, 1]);

    const result = await sut.findByUserId({
      userId: 'user-id',
      page: 1,
      limit: 10,
    });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      order: { addedAt: 'DESC' },
      take: 10,
      skip: 0,
    });
    expect(result).toEqual({
      results: favorites,
      totalDocs: 1,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });
});
