import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';

type ProfileOutput = {
  id: string;
  name: string;
  email: string;
};

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ProfileOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { id: user.id, name: user.name, email: user.email };
  }
}
