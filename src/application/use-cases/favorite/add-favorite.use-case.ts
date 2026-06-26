import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USER_FAVORITE_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserFavoriteRepository } from '../../../domain/interfaces/repositories/user-favorite-repository.interface';

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    @Inject(USER_FAVORITE_REPOSITORY)
    private readonly userFavoriteRepository: IUserFavoriteRepository,
  ) {}

  async execute(userId: string, word: string): Promise<void> {
    const normalizedWord = word.trim().toLowerCase();
    const exists = await this.userFavoriteRepository.exists(userId, normalizedWord);
    if (exists) throw new ConflictException('Word already favorited');
    await this.userFavoriteRepository.insert({ userId, word: normalizedWord });
  }
}
