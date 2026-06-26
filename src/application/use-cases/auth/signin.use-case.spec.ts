import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { SignInUseCase } from './signin.use-case';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('SignInUseCase', () => {
  const userRepository: jest.Mocked<IUserRepository> = {
    insert: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };
  const jwtService: Pick<jest.Mocked<JwtService>, 'signAsync'> = {
    signAsync: jest.fn(),
  };
  const sut = new SignInUseCase(userRepository, jwtService as JwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns auth response for valid credentials', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'User',
      email: 'user@email.com',
      passwordHash: 'hashed-password',
    } as never);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token');

    const result = await sut.execute({
      email: 'user@email.com',
      password: 'test1234',
    });

    expect(result).toEqual({
      id: 'user-id',
      name: 'User',
      token: 'token',
    });
  });

  it('throws unauthorized when user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      sut.execute({
        email: 'user@email.com',
        password: 'test1234',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws unauthorized when password is invalid', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'User',
      email: 'user@email.com',
      passwordHash: 'hashed-password',
    } as never);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      sut.execute({
        email: 'user@email.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
