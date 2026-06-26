import { Repository } from 'typeorm';
import { Word } from '../../../../domain/entities/word.entity';
import { TypeWordRepository } from './type-word.repository';

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TypeWordRepository', () => {
  const repository: MockRepo<Word> = {
    findAndCount: jest.fn(),
  };

  const sut = new TypeWordRepository(repository as unknown as Repository<Word>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('searches with ILIKE and paginates when search term is provided', async () => {
    const words = [{ id: '1', word: 'fire' }, { id: '2', word: 'firefly' }] as Word[];
    repository.findAndCount!.mockResolvedValue([words, 7]);

    const result = await sut.search({
      search: 'fire',
      page: 2,
      limit: 2,
    });

    expect(repository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 2,
        skip: 2,
      }),
    );
    expect(result).toEqual({
      results: words,
      totalDocs: 7,
      page: 2,
      totalPages: 4,
      hasNext: true,
      hasPrev: true,
    });
  });

  it('returns first page when page/limit are invalid', async () => {
    repository.findAndCount!.mockResolvedValue([[], 0]);

    const result = await sut.search({
      search: '',
      page: 0,
      limit: 0,
    });

    expect(repository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: undefined,
        take: 10,
        skip: 0,
      }),
    );
    expect(result).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('returns results with no next page', async () => {
    const words = [{ id: '1', word: 'alpha' }] as Word[];
    repository.findAndCount!.mockResolvedValue([words, 1]);

    const result = await sut.search({
      search: 'alpha',
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      results: words,
      totalDocs: 1,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });
});
