import { Inject, Injectable } from '@nestjs/common';
import { USER_FAVORITE_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserFavoriteRepository } from '../../../domain/interfaces/repositories/user-favorite-repository.interface';

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(
    @Inject(USER_FAVORITE_REPOSITORY)
    private readonly userFavoriteRepository: IUserFavoriteRepository,
  ) {}

  async execute(userId: string, word: string): Promise<void> {
    await this.userFavoriteRepository.deleteByUserAndWord(
      userId,
      word.trim().toLowerCase(),
    );
  }
}
