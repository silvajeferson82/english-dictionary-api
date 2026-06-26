import { Inject, Injectable } from '@nestjs/common';
import { PaginationResponseDto } from '../../dtos/shared/pagination-response.dto';
import { ResponseFavoriteDto } from '../../dtos/favorite/response-favorite.dto';
import { USER_FAVORITE_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserFavoriteRepository } from '../../../domain/interfaces/repositories/user-favorite-repository.interface';

@Injectable()
export class GetFavoritesUseCase {
  constructor(
    @Inject(USER_FAVORITE_REPOSITORY)
    private readonly userFavoriteRepository: IUserFavoriteRepository,
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponseDto<ResponseFavoriteDto>> {
    const result = await this.userFavoriteRepository.findByUserId({
      userId,
      page,
      limit,
    });
    return {
      ...result,
      results: result.results.map((item) => ({
        word: item.word,
        added: item.addedAt,
      })),
    };
  }
}
