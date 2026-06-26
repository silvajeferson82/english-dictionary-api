import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';
import { TypeUserRepository } from './type-user.repository';

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TypeUserRepository', () => {
  const repository: MockRepo<User> = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const sut = new TypeUserRepository(repository as unknown as Repository<User>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user when findByEmail finds data', async () => {
    const user = { id: 'user-id', email: 'john@doe.com' } as User;
    repository.findOne!.mockResolvedValue(user);

    const result = await sut.findByEmail('john@doe.com');

    expect(result).toBe(user);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'john@doe.com' },
    });
  });

  it('returns null when findByEmail does not find data', async () => {
    repository.findOne!.mockResolvedValue(null);

    const result = await sut.findByEmail('john@doe.com');

    expect(result).toBeNull();
  });
});
