import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../../dtos/auth/signin.dto';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { PayloadToken } from '../../models/payload-token.model';
import { ResponseAuthDto } from '../../dtos/auth/response-auth.dto';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: SignInDto): Promise<ResponseAuthDto> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: PayloadToken = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      name: user.name,
      token,
    };
  }
}
