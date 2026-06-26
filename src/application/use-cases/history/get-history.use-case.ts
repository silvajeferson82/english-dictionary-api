import { Inject, Injectable } from '@nestjs/common';
import { PaginationResponseDto } from '../../dtos/shared/pagination-response.dto';
import { ResponseHistoryDto } from '../../dtos/history/response-history.dto';
import { USER_HISTORY_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserHistoryRepository } from '../../../domain/interfaces/repositories/user-history-repository.interface';

@Injectable()
export class GetHistoryUseCase {
  constructor(
    @Inject(USER_HISTORY_REPOSITORY)
    private readonly userHistoryRepository: IUserHistoryRepository,
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponseDto<ResponseHistoryDto>> {
    const result = await this.userHistoryRepository.findByUserId({
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
