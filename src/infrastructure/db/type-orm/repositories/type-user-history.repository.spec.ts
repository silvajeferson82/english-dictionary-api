import { Repository } from 'typeorm';
import { UserHistory } from '../../../../domain/entities/user-history.entity';
import { TypeUserHistoryRepository } from './type-user-history.repository';

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TypeUserHistoryRepository', () => {
  const repository: MockRepo<UserHistory> = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
  };

  const sut = new TypeUserHistoryRepository(
    repository as unknown as Repository<UserHistory>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts a history record', async () => {
    const created = { userId: 'user-id', word: 'fire' } as UserHistory;
    const saved = { id: 'history-id', ...created } as UserHistory;

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

  it('returns paginated history by user id', async () => {
    const history = [{ id: 'history-id', word: 'fire' }] as UserHistory[];
    repository.findAndCount!.mockResolvedValue([history, 1]);

    const result = await sut.findByUserId({ userId: 'user-id', page: 1, limit: 10 });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      order: { addedAt: 'DESC' },
      take: 10,
      skip: 0,
    });
    expect(result).toEqual({
      results: history,
      totalDocs: 1,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });
});
