import { Inject, Injectable } from '@nestjs/common';
import { SearchWordsDto } from '../../dtos/word/search-words.dto';
import { PaginationResponseDto } from '../../dtos/shared/pagination-response.dto';
import { WORD_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IWordRepository } from '../../../domain/interfaces/repositories/word-repository.interface';
import { ResponseWordDto } from '../../dtos/word/response-word.dto';

@Injectable()
export class SearchWordsUseCase {
  constructor(
    @Inject(WORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
  ) {}

  async execute(
    input: SearchWordsDto,
  ): Promise<PaginationResponseDto<ResponseWordDto>> {
    const result = await this.wordRepository.search({
      search: input.search,
      page: input.page,
      limit: input.limit,
    });

    return {
      ...result,
      results: result.results.map((word) => ({ word: word.word })),
    };
  }
}
