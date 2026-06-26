import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFavorite } from '../../../../domain/entities/user-favorite.entity';
import {
  CreateUserFavoriteInput,
  FindUserFavoritesInput,
  FindUserFavoritesOutput,
  IUserFavoriteRepository,
} from '../../../../domain/interfaces/repositories/user-favorite-repository.interface';
import {
  buildPaginationResult,
  normalizePagination,
} from '../../../../core/helpers/pagination';

@Injectable()
export class TypeUserFavoriteRepository implements IUserFavoriteRepository {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly repository: Repository<UserFavorite>,
  ) {}

  async insert(input: CreateUserFavoriteInput): Promise<UserFavorite> {
    const entity = this.repository.create({
      userId: input.userId,
      word: input.word,
    });

    return this.repository.save(entity);
  }

  async deleteByUserAndWord(userId: string, word: string): Promise<void> {
    await this.repository.delete({ userId, word });
  }

  async findByUserId(
    input: FindUserFavoritesInput,
  ): Promise<FindUserFavoritesOutput> {
    const { page, limit, skip } = normalizePagination(input.page, input.limit);
    const [results, totalDocs] = await this.repository.findAndCount({
      where: { userId: input.userId },
      order: { addedAt: 'DESC' },
      take: limit,
      skip,
    });

    return buildPaginationResult(results, totalDocs, page, limit);
  }

  async exists(userId: string, word: string): Promise<boolean> {
    return this.repository.exists({ where: { userId, word } });
  }
}
