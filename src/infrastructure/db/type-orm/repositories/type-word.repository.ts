import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Word } from '../../../../domain/entities/word.entity';
import {
  CreateWordInput,
  IWordRepository,
  SearchWordsInput,
  SearchWordsOutput,
} from '../../../../domain/interfaces/repositories/word-repository.interface';
import {
  buildPaginationResult,
  normalizePagination,
} from '../../../../core/helpers/pagination';

@Injectable()
export class TypeWordRepository implements IWordRepository {
  constructor(
    @InjectRepository(Word)
    private readonly repository: Repository<Word>,
  ) {}

  async insert(input: CreateWordInput): Promise<Word> {
    const entity = this.repository.create({
      word: input.word,
      data: input.data,
    });

    return this.repository.save(entity);
  }

  findByWord(word: string): Promise<Word | null> {
    return this.repository.findOne({ where: { word } });
  }

  findById(id: string): Promise<Word | null> {
    return this.repository.findOne({ where: { id } });
  }

  async search(input: SearchWordsInput): Promise<SearchWordsOutput> {
    const { page, limit, skip } = normalizePagination(input.page, input.limit);
    const normalizedSearch = input.search?.trim();

    const [results, totalDocs] = await this.repository.findAndCount({
      where: normalizedSearch
        ? {
            word: ILike(`%${normalizedSearch}%`),
          }
        : undefined,
      order: {
        word: 'ASC',
      },
      take: limit,
      skip,
    });

    return buildPaginationResult(results, totalDocs, page, limit);
  }
}
