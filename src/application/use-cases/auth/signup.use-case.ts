import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from '../../dtos/auth/signup.dto';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { PayloadToken } from '../../models/payload-token.model';
import { ResponseAuthDto } from '../../dtos/auth/response-auth.dto';

@Injectable()
export class SignUpUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: SignUpDto): Promise<ResponseAuthDto> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.insert({
      name: input.name,
      email: input.email,
      passwordHash,
    });

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
