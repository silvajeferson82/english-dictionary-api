import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { USER_HISTORY_REPOSITORY, WORD_REPOSITORY } from '../../../domain/interfaces/repositories/tokens';
import type { IUserHistoryRepository } from '../../../domain/interfaces/repositories/user-history-repository.interface';
import type { IWordRepository } from '../../../domain/interfaces/repositories/word-repository.interface';

@Injectable()
export class GetWordDetailUseCase {
  constructor(
    @Inject(WORD_REPOSITORY)
    private readonly wordRepository: IWordRepository,
    @Inject(USER_HISTORY_REPOSITORY)
    private readonly userHistoryRepository: IUserHistoryRepository,
  ) {}

  async execute(userId: string, word: string): Promise<unknown> {
    const normalizedWord = word.trim().toLowerCase();
    if (!normalizedWord) {
      throw new HttpException('Word is required', HttpStatus.BAD_REQUEST);
    }

    const existing = await this.wordRepository.findByWord(normalizedWord);
    let data = existing?.data;

    if (!data) {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalizedWord)}`,
      );
      if (!response.ok) {
        throw new HttpException('Word not found', HttpStatus.NOT_FOUND);
      }
      data = (await response.json()) as unknown;
      await this.wordRepository.insert({
        word: normalizedWord,
        data,
      });
    }

    await this.userHistoryRepository.insert({
      userId,
      word: normalizedWord,
    });

    return data;
  }
}
