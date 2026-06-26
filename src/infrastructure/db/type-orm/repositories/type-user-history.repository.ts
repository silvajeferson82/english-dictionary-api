import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHistory } from '../../../../domain/entities/user-history.entity';
import {
  CreateUserHistoryInput,
  FindUserHistoryInput,
  FindUserHistoryOutput,
  IUserHistoryRepository,
} from '../../../../domain/interfaces/repositories/user-history-repository.interface';
import {
  buildPaginationResult,
  normalizePagination,
} from '../../../../core/helpers/pagination';

@Injectable()
export class TypeUserHistoryRepository implements IUserHistoryRepository {
  constructor(
    @InjectRepository(UserHistory)
    private readonly repository: Repository<UserHistory>,
  ) {}

  async insert(input: CreateUserHistoryInput): Promise<UserHistory> {
    const entity = this.repository.create({
      userId: input.userId,
      word: input.word,
    });

    return this.repository.save(entity);
  }

  async findByUserId(input: FindUserHistoryInput): Promise<FindUserHistoryOutput> {
    const { page, limit, skip } = normalizePagination(input.page, input.limit);
    const [results, totalDocs] = await this.repository.findAndCount({
      where: { userId: input.userId },
      order: { addedAt: 'DESC' },
      take: limit,
      skip,
    });

    return buildPaginationResult(results, totalDocs, page, limit);
  }
}
