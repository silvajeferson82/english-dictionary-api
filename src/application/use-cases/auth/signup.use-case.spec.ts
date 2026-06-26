import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { SignUpUseCase } from './signup.use-case';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('SignUpUseCase', () => {
  const userRepository: jest.Mocked<IUserRepository> = {
    insert: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };
  const jwtService: Pick<jest.Mocked<JwtService>, 'signAsync'> = {
    signAsync: jest.fn(),
  };
  const sut = new SignUpUseCase(userRepository, jwtService as JwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates user and returns auth response', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.insert.mockResolvedValue({
      id: 'user-id',
      name: 'User',
      email: 'user@email.com',
    } as never);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    jwtService.signAsync.mockResolvedValue('token');

    const result = await sut.execute({
      name: 'User',
      email: 'user@email.com',
      password: 'test1234',
    });

    expect(userRepository.insert).toHaveBeenCalledWith({
      name: 'User',
      email: 'user@email.com',
      passwordHash: 'hashed-password',
    });
    expect(result).toEqual({
      id: 'user-id',
      name: 'User',
      token: 'token',
    });
  });

  it('throws conflict when email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 'existing' } as never);

    await expect(
      sut.execute({
        name: 'User',
        email: 'user@email.com',
        password: 'test1234',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
