import { Test } from '@nestjs/testing';
import { SignInUseCase } from '../../application/use-cases/auth/signin.use-case';
import { SignUpUseCase } from '../../application/use-cases/auth/signup.use-case';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  const signUpUseCase = { execute: jest.fn() };
  const signInUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: SignUpUseCase, useValue: signUpUseCase },
        { provide: SignInUseCase, useValue: signInUseCase },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
    jest.clearAllMocks();
  });

  it('calls signUp use case', async () => {
    signUpUseCase.execute.mockResolvedValue({
      id: 'user-id',
      name: 'User',
      token: 'token',
    });
    const dto = {
      name: 'User',
      email: 'user@email.com',
      password: 'test1234',
    };

    const result = await controller.signup(dto);

    expect(signUpUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      id: 'user-id',
      name: 'User',
      token: 'token',
    });
  });

  it('calls signIn use case', async () => {
    signInUseCase.execute.mockResolvedValue({
      id: 'user-id',
      name: 'User',
      token: 'token',
    });
    const dto = {
      email: 'user@email.com',
      password: 'test1234',
    };

    const result = await controller.signin(dto);

    expect(signInUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      id: 'user-id',
      name: 'User',
      token: 'token',
    });
  });
});
